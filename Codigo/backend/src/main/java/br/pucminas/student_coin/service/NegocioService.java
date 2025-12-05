package br.pucminas.student_coin.service;

import br.pucminas.student_coin.model.*;
import br.pucminas.student_coin.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class NegocioService {

    @Autowired private ProfessorRepository professorRepository;
    @Autowired private AlunoRepository alunoRepository;
    @Autowired private TransacaoRepository transacaoRepository;
    @Autowired private VantagemRepository vantagemRepository;
    @Autowired private CupomRepository cupomRepository;
    @Autowired private QrCodeService qrCodeService;
    @Autowired private EmailService emailService;

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

            // --- TEMPLATE HTML ATUALIZADO E COMPLETO ---
            String corpoEmailAluno = String.format(
                "<div style='font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;'>" +
                "<h2 style='color: #6200ea;'>Vantagem Resgatada com Sucesso!</h2>" +
                "<p>Olá %s,</p>" +
                "<p>Você resgatou a vantagem <strong>'%s'</strong> da empresa <strong>%s</strong>.</p>" +
                "<hr>" +
                "<div style='text-align: center;'>" +
                "<p>Apresente o código ou o QR Code abaixo no estabelecimento:</p>" +
                "<img src='%s' alt='Imagem da Vantagem' style='max-width: 100%%; height: auto; border-radius: 8px; margin-bottom: 20px;' />" +
                // Código do Cupom
                "<h1 style='font-size: 36px; letter-spacing: 4px; margin: 10px 0;'>%s</h1>" +
                // QR Code (será adicionado pelo EmailService)
                "</div>" +
                "</div>",
                aluno.getNome(), 
                vantagem.getNome(), 
                vantagem.getEmpresaParceira().getNome(),
                vantagem.getUrlFoto() != null ? vantagem.getUrlFoto() : "https://via.placeholder.com/600x300.png?text=Vantagem+Sem+Imagem", // Usa um placeholder se não houver foto
                cupom.getCodigo()
            );

            emailService.enviarEmailComQrCode(aluno.getEmail(), "Seu Cupom StudentCoin - " + vantagem.getNome(), corpoEmailAluno, qrCodeBytes);

            // E-mail para a empresa (não precisa do QR Code)
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
