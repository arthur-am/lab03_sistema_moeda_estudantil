package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.Aluno;
import br.pucminas.student_coin.model.Transacao;
import br.pucminas.student_coin.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")

public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    // CREATE
    @PostMapping
    public ResponseEntity<Aluno> criar(@RequestBody Aluno aluno) {
        Aluno novoAluno = alunoService.salvar(aluno);
        return new ResponseEntity<>(novoAluno, HttpStatus.CREATED);
    }
    
    // READ ALL
    @GetMapping
    public List<Aluno> listarTodos() {
        return alunoService.listarTodos();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Long id) {
        return alunoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Aluno> atualizar(@PathVariable Long id, @RequestBody Aluno aluno) {
        return alunoService.buscarPorId(id)
                .map(alunoExistente -> {
                    aluno.setId(id);
                    Aluno alunoAtualizado = alunoService.salvar(aluno);
                    return ResponseEntity.ok(alunoAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!alunoService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        alunoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
    
    // READ EXTRATO
    @GetMapping("/{id}/extrato")
    public ResponseEntity<List<Transacao>> getExtrato(@PathVariable Long id) {
        List<Transacao> extrato = alunoService.getExtrato(id);
        return ResponseEntity.ok(extrato);
    }
}
