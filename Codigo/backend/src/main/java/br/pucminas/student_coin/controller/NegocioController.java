package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.Transacao;
import br.pucminas.student_coin.service.NegocioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/negocio")
@CrossOrigin(origins = "http://localhost:3000")
public class NegocioController {

    @Autowired
    private NegocioService negocioService;

    public record EnvioMoedaRequest(Long professorId, String alunoEmail, double quantidade, String motivo) {
    }

    public record ResgateRequest(Long alunoId, Long vantagemId) {}

    @PostMapping("/enviar-moedas")
    public ResponseEntity<?> enviarMoedas(@RequestBody EnvioMoedaRequest request) {
        try {
            Transacao novaTransacao = negocioService.enviarMoedasPorEmail(
                    request.professorId(),
                    request.alunoEmail(),
                    request.quantidade(),
                    request.motivo());
            return ResponseEntity.ok(novaTransacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resgatar-vantagem")
    public ResponseEntity<?> resgatarVantagem(@RequestBody ResgateRequest request) {
        try {
            // Chama o método que já existe no seu NegocioService
            negocioService.resgatarVantagem(request.alunoId(), request.vantagemId());
            // Retorna uma mensagem de sucesso
            return ResponseEntity.ok().body("Vantagem resgatada com sucesso! Verifique seu email.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
