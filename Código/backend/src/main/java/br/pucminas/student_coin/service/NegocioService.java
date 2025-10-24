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

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NegocioService {

    @Autowired private ProfessorRepository professorRepository;
    @Autowired private AlunoRepository alunoRepository;
    @Autowired private TransacaoRepository transacaoRepository;
    @Autowired private EmailService emailService;
    @Autowired private VantagemRepository vantagemRepository;
    @Autowired private CupomRepository cupomRepository;

    @Transactional // Garante que todas as operações ocorram ou nenhuma (atomicidade)
    public void enviarMoedas(Long professorId, Long alunoId, double quantidade, String motivo) {
        // 1. Validação de obrigatoriedade do motivo
        if (motivo == null || motivo.trim().isEmpty()) {
            throw new IllegalArgumentException("O motivo do envio é obrigatório.");
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
        transacaoRepository.save(transacao);

        // 7. Requisito: Notificar aluno por email
        String assunto = "Você recebeu moedas student_coin!";
        String texto = String.format(
            "Olá %s,\n\nVocê acabou de receber %.2f moedas do professor(a) %s.\nMotivo: %s\n\nSeu saldo atual é: %.2f",
            aluno.getNome(), quantidade, professor.getNome(), motivo, aluno.getSaldoMoedas()
        );
        emailService.enviarEmail(aluno.getEmail(), assunto, texto);
    }
    @Transactional
    public Cupom resgatarVantagem(Long alunoId, Long vantagemId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));
        Vantagem vantagem = vantagemRepository.findById(vantagemId)
                .orElseThrow(() -> new RuntimeException("Vantagem não encontrada!"));

        // Regra de Negócio: Verificar saldo do aluno
        if (aluno.getSaldoMoedas() < vantagem.getCustoMoedas()) {
            throw new RuntimeException("Saldo insuficiente para resgatar esta vantagem.");
        }

        // Atualiza saldo do aluno
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() - vantagem.getCustoMoedas());
        alunoRepository.save(aluno);

        // Gera o cupom
        Cupom cupom = new Cupom();
        cupom.setAluno(aluno);
        cupom.setVantagem(vantagem);
        cupom.setCodigo(UUID.randomUUID().toString().toUpperCase().substring(0, 8)); // Gera código único
        cupomRepository.save(cupom);
        
        // Registra a transação para o extrato
        Transacao transacao = new Transacao();
        transacao.setIdOrigem(alunoId); // Aluno "paga"
        transacao.setIdDestino(vantagem.getEmpresaParceira().getId()); // Empresa "recebe"
        transacao.setValor(vantagem.getCustoMoedas());
        transacao.setMotivo("Resgate: " + vantagem.getNome());
        transacao.setTipo(Transacao.TipoTransacao.RESGATE);
        transacaoRepository.save(transacao);

        // Notificar aluno por email com o cupom
        String assuntoAluno = "Vantagem resgatada com sucesso!";
        String textoAluno = String.format(
            "Olá %s,\n\nVocê resgatou a vantagem '%s'.\n\nUse o seguinte código para validação: %s",
            aluno.getNome(), vantagem.getNome(), cupom.getCodigo()
        );
        emailService.enviarEmail(aluno.getEmail(), assuntoAluno, textoAluno);

        // Notificar parceiro por email
        String assuntoParceiro = "Um cliente resgatou uma de suas vantagens!";
        String textoParceiro = String.format(
            "Olá %s,\n\nO aluno %s (CPF: %s) resgatou a vantagem '%s'.\n\nO código para conferência é: %s",
            vantagem.getEmpresaParceira().getNome(), aluno.getNome(), aluno.getCpf(), vantagem.getNome(), cupom.getCodigo()
        );
        emailService.enviarEmail(vantagem.getEmpresaParceira().getEmail(), assuntoParceiro, textoParceiro);
        
        return cupom;
    }
}
