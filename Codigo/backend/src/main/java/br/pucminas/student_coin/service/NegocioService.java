package br.pucminas.student_coin.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

@Service
public class NegocioService {

    @Autowired
    private ProfessorRepository professorRepository;
    @Autowired
    private AlunoRepository alunoRepository;
    @Autowired
    private TransacaoRepository transacaoRepository;
    @Autowired
    private VantagemRepository vantagemRepository;
    @Autowired
    private CupomRepository cupomRepository;
    @Autowired
    private QrCodeService qrCodeService;
    @Autowired
    private EmailService emailService;

    @Transactional
    public Transacao enviarMoedasPorEmail(Long professorId, String alunoEmail, double quantidade, String motivo) {
        Aluno aluno = alunoRepository.findByEmail(alunoEmail)
                .orElseThrow(() -> new RuntimeException("Aluno com o email '" + alunoEmail + "' não foi encontrado."));
        return this.enviarMoedas(professorId, aluno.getId(), quantidade, motivo);
    }

    @Transactional
    public Transacao enviarMoedas(Long professorId, Long alunoId, double quantidade, String motivo) {
        if (motivo == null || motivo.trim().isEmpty()) {
            throw new IllegalArgumentException("O motivo do envio é obrigatório.");
        }
        if (quantidade <= 0) {
            throw new IllegalArgumentException("A quantidade de moedas deve ser positiva.");
        }

        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado!"));
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado!"));

        if (professor.getSaldoMoedas() < quantidade) {
            throw new RuntimeException("Saldo insuficiente para realizar a transação.");
        }

        professor.setSaldoMoedas(professor.getSaldoMoedas() - quantidade);
        aluno.setSaldoMoedas(aluno.getSaldoMoedas() + quantidade);

        professorRepository.save(professor);
        alunoRepository.save(aluno);

        Transacao transacao = new Transacao();
        transacao.setIdOrigem(professorId);
        transacao.setIdDestino(alunoId);
        transacao.setValor(quantidade);
        transacao.setMotivo(motivo);
        transacao.setTipo(Transacao.TipoTransacao.ENVIO);
        Transacao transacaoSalva = transacaoRepository.save(transacao);

        String corpoEmail = String.format(
                "<h3>Olá %s,</h3><p>Você acabou de receber <strong>%.2f moedas</strong> do professor(a) %s.</p><p><strong>Motivo:</strong> %s</p><p>Seu saldo atual é: <strong>%.2f</strong></p>",
                aluno.getNome(), quantidade, professor.getNome(), motivo, aluno.getSaldoMoedas()
        );
        emailService.enviarEmailSimples(aluno.getEmail(), "Você recebeu StudentCoins!", corpoEmail);

        return transacaoSalva;
    }

    @Transactional
    public Cupom resgatarVantagem(Long alunoId, Long vantagemId) {
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

        try {
            byte[] qrCodeBytes = qrCodeService.generateQRCodeImage(cupom.getCodigo(), 250, 250);

            String corpoEmailAluno = String.format(
                    "<h3>Vantagem Resgatada!</h3><p>Olá %s, use o código ou o QR Code abaixo para validar seu resgate:</p><h2>%s</h2>",
                    aluno.getNome(), cupom.getCodigo()
            );
            emailService.enviarEmailComQrCode(aluno.getEmail(), "Seu Cupom StudentCoin!", corpoEmailAluno, qrCodeBytes);

            String corpoEmailEmpresa = String.format(
                    "<h3>Nova Vantagem Resgatada!</h3><p>O aluno <strong>%s</strong> resgatou a vantagem <strong>'%s'</strong>.</p><p>Código para conferência: <strong>%s</strong></p>",
                    aluno.getNome(), vantagem.getNome(), cupom.getCodigo()
            );
            emailService.enviarEmailSimples(vantagem.getEmpresaParceira().getEmail(), "Uma de suas vantagens foi resgatada!", corpoEmailEmpresa);

        } catch (Exception e) {
            System.err.println("CRÍTICO: Falha ao gerar QR Code ou enviar email de notificação: " + e.getMessage());
        }

        return cupom;
    }
}
