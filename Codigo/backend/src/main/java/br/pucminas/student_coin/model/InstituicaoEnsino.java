package br.pucminas.student_coin.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class InstituicaoEnsino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @JsonIgnore
    @OneToMany(mappedBy = "instituicaoEnsino")
    private List<Aluno> alunos;
    
    @JsonIgnore
    @OneToMany(mappedBy = "instituicaoEnsino")
    private List<Professor> professores;
}
