package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.Transacao;
import br.pucminas.student_coin.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/professores")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfessorController {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @GetMapping("/{id}/extrato")
    public ResponseEntity<List<Transacao>> getExtrato(@PathVariable Long id) {
        List<Transacao> extrato = transacaoRepository.findByIdOrigem(id);
        return ResponseEntity.ok(extrato);
    }
}