package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.EmpresaParceira;
import br.pucminas.student_coin.model.Vantagem; // Importe a Vantagem
import br.pucminas.student_coin.repository.VantagemRepository; // Importe o VantagemRepository
import br.pucminas.student_coin.service.EmpresaParceiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/empresas")

public class EmpresaParceiraController {

    @Autowired
    private EmpresaParceiraService service;

    @Autowired
    private VantagemRepository vantagemRepository;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody EmpresaParceira empresa) {
        try {
            EmpresaParceira novaEmpresa = service.salvar(empresa);
            return new ResponseEntity<>(novaEmpresa, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{id}/vantagens")
    public ResponseEntity<List<Vantagem>> listarVantagensPorEmpresa(@PathVariable Long id) {
        List<Vantagem> vantagens = vantagemRepository.findByEmpresaParceiraId(id);
        return ResponseEntity.ok(vantagens);
    }
}
