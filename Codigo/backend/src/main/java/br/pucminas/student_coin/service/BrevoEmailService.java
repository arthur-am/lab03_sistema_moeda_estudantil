package br.pucminas.student_coin.service;

import java.util.Base64;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import sibApi.TransactionalEmailsApi;
import sibModel.SendSmtpEmail;
import sibModel.SendSmtpEmailSender;
import sibModel.SendSmtpEmailTo;

@Service
@Profile("prod")
public class BrevoEmailService implements EmailService {

    private final TransactionalEmailsApi apiInstance;
    private final String senderName;
    private final String senderEmail;

    public BrevoEmailService(@Value("${brevo.api.key}") String brevoApiKey,
            @Value("${brevo.sender.name}") String senderName,
            @Value("${brevo.sender.email}") String senderEmail) {
        this.apiInstance = new TransactionalEmailsApi();
        this.apiInstance.getApiClient().setApiKey(brevoApiKey);
        this.senderName = senderName;
        this.senderEmail = senderEmail;
    }

    @Override
    public void enviarEmailSimples(String para, String assunto, String corpoHtml) {
        SendSmtpEmail email = createEmailBase(para, assunto, corpoHtml);
        try {
            apiInstance.sendTransacEmail(email);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email via Brevo: " + e.getMessage());
        }
    }

    @Override
    public void enviarEmailComQrCode(String para, String assunto, String corpoHtml, byte[] qrCodeBytes) {
        String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCodeBytes);
        String imgTag = String.format("<img src=\"data:image/png;base64,%s\" alt=\"QR Code de Resgate\" />", qrCodeBase64);
        String corpoHtmlCompleto = corpoHtml + imgTag;

        SendSmtpEmail email = createEmailBase(para, assunto, corpoHtmlCompleto);

        try {
            apiInstance.sendTransacEmail(email);
        } catch (Exception e) {
            System.err.println("Erro ao enviar email com QR Code via Brevo: " + e.getMessage());
        }
    }

    private SendSmtpEmail createEmailBase(String para, String assunto, String corpoHtml) {
        SendSmtpEmail email = new SendSmtpEmail();
        email.setSender(new SendSmtpEmailSender().name(senderName).email(senderEmail));
        email.setTo(Collections.singletonList(new SendSmtpEmailTo().email(para)));
        email.setSubject(assunto);
        email.setHtmlContent(corpoHtml);
        return email;
    }
}
