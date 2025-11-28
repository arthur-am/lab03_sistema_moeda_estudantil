package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.EmpresaParceira;
import br.pucminas.student_coin.service.EmpresaParceiraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/empresas")
@CrossOrigin(origins = "http://localhost:3000")
public class EmpresaParceiraController {

    @Autowired
    private EmpresaParceiraService service;

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody EmpresaParceira empresa) {
        try {
            EmpresaParceira novaEmpresa = service.salvar(empresa);
            return new ResponseEntity<>(novaEmpresa, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
