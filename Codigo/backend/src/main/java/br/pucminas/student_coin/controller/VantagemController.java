package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.Vantagem;
import br.pucminas.student_coin.repository.VantagemRepository;
import br.pucminas.student_coin.service.VantagemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vantagens")

public class VantagemController {

    @Autowired
    private VantagemService service;

    @GetMapping
    public List<Vantagem> listarTodas() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<Vantagem> criar(@RequestBody Vantagem vantagem) {
        Vantagem novaVantagem = service.salvar(vantagem);
        return new ResponseEntity<>(novaVantagem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vantagem> atualizar(@PathVariable Long id, @RequestBody Vantagem vantagem) {
        vantagem.setId(id);
        Vantagem vantagemAtualizada = service.salvar(vantagem);
        return ResponseEntity.ok(vantagemAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
