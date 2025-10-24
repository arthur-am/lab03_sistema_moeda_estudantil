package br.pucminas.student_coin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class EmpresaParceira {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String cnpj;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;
    @JsonIgnore
    @OneToMany(mappedBy = "empresaParceira", cascade = CascadeType.ALL)
    private List<Vantagem> vantagens;
}
