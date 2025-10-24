package br.pucminas.student_coin.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Professor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false, unique = true)
    private String cpf;

    private String departamento;

    @Column(nullable = false)
    private String senha;

    @Column(columnDefinition = "double precision default 1000.0")
    private double saldoMoedas = 1000;

    @ManyToOne
    @JoinColumn(name = "instituicao_id", nullable = false)
    private InstituicaoEnsino instituicaoEnsino;
}
