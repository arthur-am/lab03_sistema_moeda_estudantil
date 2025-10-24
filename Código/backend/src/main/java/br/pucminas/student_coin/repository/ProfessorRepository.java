package br.pucminas.student_coin.repository;

import br.pucminas.student_coin.model.Professor;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByEmail(String email);
}