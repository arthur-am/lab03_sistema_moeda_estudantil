package br.pucminas.student_coin.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import sibApi.TransactionalEmailsApi;
import sibModel.*;
import java.util.Base64;
import java.util.Collections;

@Service
@Profile("prod")
public class BrevoEmailService implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(BrevoEmailService.class);

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
            logger.info("Email simples enviado com sucesso para {} via Brevo", para);
        } catch (Exception e) {
            // --- LOGGING MELHORADO ---
            logger.error("Falha ao enviar email simples via Brevo para {}", para, e);
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
            logger.info("Email com QR Code enviado com sucesso para {} via Brevo", para);
        } catch (Exception e) {
            // --- LOGGING MELHORADO ---
            logger.error("Falha ao enviar email com QR Code via Brevo para {}", para, e);
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
