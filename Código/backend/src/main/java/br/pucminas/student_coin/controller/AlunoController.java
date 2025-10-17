package br.pucminas.studentcoin.controller;

import br.pucminas.studentcoin.model.Aluno;
import br.pucminas.studentcoin.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
@CrossOrigin(origins = "http://localhost:5173") // Permite requisições do frontend React
public class AlunoController {

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public List<Aluno> listarTodos() {
        return alunoService.listarTodos();
    }

    @PostMapping
    public ResponseEntity<Aluno> criar(@RequestBody Aluno aluno) {
        Aluno novoAluno = alunoService.salvar(aluno);
        return new ResponseEntity<>(novoAluno, HttpStatus.CREATED);
    }
    
    // Implementar GET por ID, PUT e DELETE de forma similar
}
