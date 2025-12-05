package br.pucminas.student_coin.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
@Profile("dev") // Só ativa este serviço se o perfil for "dev"
public class SmtpEmailService implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Override
    public void enviarEmailSimples(String para, String assunto, String corpoHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(corpoHtml, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email via SMTP: " + e.getMessage());
        }
    }

    @Override
    public void enviarEmailComQrCode(String para, String assunto, String corpoHtml, byte[] qrCodeBytes) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(corpoHtml, true);
            helper.addInline("qrCodeImage", new ByteArrayResource(qrCodeBytes), "image/png");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email com QR Code via SMTP: " + e.getMessage());
        }
    }
}
