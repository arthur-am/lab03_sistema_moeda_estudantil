package br.pucminas.student_coin.service;

import br.pucminas.student_coin.model.Aluno;
import br.pucminas.student_coin.model.Cupom;
import br.pucminas.student_coin.model.Professor;
import br.pucminas.student_coin.model.Transacao;
import br.pucminas.student_coin.model.Vantagem;
import br.pucminas.student_coin.repository.AlunoRepository;
import br.pucminas.student_coin.repository.CupomRepository;
import br.pucminas.student_coin.repository.ProfessorRepository;
import br.pucminas.student_coin.repository.TransacaoRepository;
import br.pucminas.student_coin.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class NegocioService {

    @Autowired private ProfessorRepository professorRepository;
    @Autowired private AlunoRepository alunoRepository;
    @Autowired private TransacaoRepository transacaoRepository;
    @Autowired private EmailService emailService;
    @Autowired private VantagemRepository vantagemRepository;
    @Autowired private CupomRepository cupomRepository;

    /**
     * Orquestra o envio de moedas a partir do email do aluno.
     * Este é o método que deve ser chamado pelo Controller.
     */
    @Transactional
    public Transacao enviarMoedasPorEmail(Long professorId, String alunoEmail, double quantidade, String motivo) {
        // Busca o aluno pelo email fornecido pelo frontend
        Aluno aluno = alunoRepository.findByEmail(alunoEmail)
                .orElseThrow(() -> new RuntimeException("Aluno com o email '" + alunoEmail + "' não foi encontrado."));
        
        // Com o aluno encontrado, chama a lógica principal de negócio passando o ID do aluno
        return this.enviarMoedas(professorId, aluno.getId(), quantidade, motivo);
    }

    /**
     * Lógica principal de negócio para a transferência de moedas.
     * Agora retorna a Transacao criada para ser usada na resposta da API.
     */
    @Transactional
    public Transacao enviarMoedas(Long professorId, Long alunoId, double quantidade, String motivo) {
        // 1. Validação de obrigatoriedade do motivo
        if (motivo == null || motivo.trim().isEmpty()) {
            throw new IllegalArgumentException("O motivo do envio é obrigatório.");
        }
        if (quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade de moedas deve ser positiva.");
        }

        // 2. Busca as entidades no banco de dados
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado!"));
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        // 3. Regra de Negócio: Verificar saldo do professor
        if (professor.getSaldoMoedas() < quantidade) {
            throw new RuntimeException("Saldo insuficiente para realizar a transação.");
        }

        // 4. Atualiza os saldos
        professor.setSaldoMoedas(professor.getSaldoMoedas() - quantidade);
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + quantidade);

        // 5. Salva as alterações no banco
        professorRepository.save(professor);
        alunoRepository.save(aluno);
        
        // 6. Registra a transação para o extrato
        Transacao transacao = new Transacao();
        transacao.setIdOrigem(professorId);
        transacao.setIdDestino(alunoId);
        transacao.setValor(quantidade);
        transacao.setMotivo(motivo);
        transacao.setTipo(Transacao.TipoTransacao.ENVIO);
        Transacao transacaoSalva = transacaoRepository.save(transacao);

        // 7. Requisito: Notificar aluno por email
        String assunto = "Você recebeu StudentCoins!";
        String texto = String.format(
            "Olá %s,\n\nVocê acabou de receber %.2f moedas do professor(a) %s.\nMotivo: %s\n\nSeu saldo atual é: %.2f",
            aluno.getNome(), quantidade, professor.getNome(), motivo, aluno.getSaldoMoedas()
        );
        emailService.enviarEmail(aluno.getEmail(), assunto, texto);
        
        // Retorna a transação que foi salva no banco
        return transacaoSalva;
    }
    
    @Transactional
    public Cupom resgatarVantagem(Long alunoId, Long vantagemId) {
        // ... (seu método de resgate de vantagem, que já estava correto)
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada!"));

        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new RuntimeException("Saldo insuficiente para resgatar esta vantagem.");
        }

        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        Cupom cupom = new Cupom();
        cupom.setAluno(aluno);
        cupom.setVantagem(vantagem);
        cupom.setCodigo(UUID.randomUUID().toString().toUpperCase().substring(0, 8));
        cupomRepository.save(cupom);
        
        Transacao transacao = new Transacao();
        transacao.setIdOrigem(alunoId);
        transacao.setIdDestino(vantagem.getEmpresaParceira().getId());
        transacao.setValor(vantagem.getCustoMoedas());
        transacao.setMotivo("Resgate: " + vantagem.getNome());
        transacao.setTipo(Transacao.TipoTransacao.RESGATE);
        transacaoRepository.save(transacao);

        String assuntoAluno = "Vantagem resgatada com sucesso!";
        String textoAluno = String.format(
            "Olá %s,\n\nVocê resgatou a vantagem '%s'.\n\nUse o seguinte código para validação: %s",
            aluno.getNome(), vantagem.getNome(), cupom.getCodigo()
        );
        emailService.enviarEmail(aluno.getEmail(), assuntoAluno, textoAluno);

        String assuntoParceiro = "Um cliente resgatou uma de suas vantagens!";
        String textoParceiro = String.format(
            "Olá %s,\n\nO aluno %s (CPF: %s) resgatou a vantagem '%s'.\n\nO código para conferência é: %s",
            vantagem.getEmpresaParceira().getNome(), aluno.getNome(), aluno.getCpf(), vantagem.getNome(), cupom.getCodigo()
        );
        emailService.enviarEmail(vantagem.getEmpresaParceira().getEmail(), assuntoParceiro, textoParceiro);
        
        return cupom;
    }
}
