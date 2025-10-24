package br.pucminas.student_coin.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Cupom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne
    @JoinColumn(name = "vantagem_id", nullable = false)
    private Vantagem vantagem;

    private LocalDateTime dataGeracao = LocalDateTime.now();
    
    private boolean utilizado = false;
}