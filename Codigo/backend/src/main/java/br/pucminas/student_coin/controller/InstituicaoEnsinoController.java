package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.InstituicaoEnsino;
import br.pucminas.student_coin.repository.InstituicaoEnsinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
 // Permite a comunicação com o frontend
public class InstituicaoEnsinoController {

    @Autowired
    private InstituicaoEnsinoRepository instituicaoRepository;

    /**
     * Endpoint que retorna uma lista de todas as instituições de ensino
     * cadastradas no banco de dados.
     * É consumido pela tela de cadastro de aluno para popular o campo de seleção.
     * 
     * @return Uma lista de objetos InstituicaoEnsino.
     */
    @GetMapping
    public List<InstituicaoEnsino> listarTodas() {
        // O método findAll() é fornecido pelo JpaRepository e busca todos os
        // registros da tabela correspondente.
        return instituicaoRepository.findAll();
    }
}