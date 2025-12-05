package br.pucminas.student_coin.service;

public interface EmailService {
    void enviarEmailSimples(String para, String assunto, String corpoHtml);
    void enviarEmailComQrCode(String para, String assunto, String corpoHtml, byte[] qrCodeBytes);
}