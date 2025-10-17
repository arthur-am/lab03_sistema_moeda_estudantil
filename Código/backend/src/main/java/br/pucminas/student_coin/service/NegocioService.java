package br.pucminas.studentcoin.service;

import br.pucminas.studentcoin.model.Aluno;
import br.pucminas.studentcoin.model.Professor;
import br.pucminas.studentcoin.model.Transacao;
import br.pucminas.studentcoin.repository.AlunoRepository;
import br.pucminas.studentcoin.repository.ProfessorRepository;
import br.pucminas.studentcoin.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NegocioService {

    @Autowired private ProfessorRepository professorRepository;
    @Autowired private AlunoRepository alunoRepository;
    @Autowired private TransacaoRepository transacaoRepository;
    @Autowired private EmailService emailService;

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
        String assunto = "Você recebeu moedas StudentCoin!";
        String texto = String.format(
            "Olá %s,\n\nVocê acabou de receber %.2f moedas do professor(a) %s.\nMotivo: %s\n\nSeu saldo atual é: %.2f",
            aluno.getNome(), quantidade, professor.getNome(), motivo, aluno.getSaldoMoedas()
        );
        emailService.enviarEmail(aluno.getEmail(), assunto, texto);
    }
    
    // Aqui você implementaria a lógica de resgate de vantagem, que também dispararia emails
}