package br.pucminas.student_coin.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String cpf;

    @Column(unique = true)
    private String rg;

    private String endereco;
    
    private String curso;

    @Column(nullable = false)
    private String senha;

    private double saldoMoedas = 0.0;

    @ManyToOne
    @JoinColumn(name = "instituicao_id", nullable = false)
    private InstituicaoEnsino instituicaoEnsino;
}