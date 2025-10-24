package br.pucminas.student_coin.repository;

import br.pucminas.student_coin.model.InstituicaoEnsino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstituicaoEnsinoRepository extends JpaRepository<InstituicaoEnsino, Long> {}