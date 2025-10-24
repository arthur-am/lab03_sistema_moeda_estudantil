package br.pucminas.student_coin.controller;

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

    public static record EnvioMoedaRequest(Long professorId, Long alunoId, double quantidade, String motivo) {}

    @PostMapping("/enviar-moedas")
    public ResponseEntity<String> enviarMoedas(@RequestBody EnvioMoedaRequest request) {
        try {
            negocioService.enviarMoedas(request.professorId(), request.alunoId(), request.quantidade(), request.motivo());
            return ResponseEntity.ok("Moedas enviadas com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
