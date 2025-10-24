package br.pucminas.student_coin.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Vantagem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(length = 1000)
    private String descricao;
    
    private String urlFoto;

    @Column(nullable = false)
    private double custoMoedas;

    @ManyToOne
    @JoinColumn(name = "empresa_id", nullable = false)
    private EmpresaParceira empresaParceira;
}
