package br.pucminas.student_coin.repository;

import br.pucminas.student_coin.model.EmpresaParceira;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, Long> {
    Optional<EmpresaParceira> findByEmail(String email);
}
