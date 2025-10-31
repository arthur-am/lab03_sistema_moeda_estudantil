package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.Vantagem;
import br.pucminas.student_coin.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vantagens")
@CrossOrigin(origins = "http://localhost:3000")
public class VantagemController {

    @Autowired
    private VantagemRepository vantagemRepository;

    @GetMapping
    public List<Vantagem> listarTodas() {
        return vantagemRepository.findAll();
    }
}
