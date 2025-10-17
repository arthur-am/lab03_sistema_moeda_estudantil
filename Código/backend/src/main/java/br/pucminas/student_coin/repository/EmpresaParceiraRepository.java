package br.pucminas.studentcoin.repository;

import br.pucminas.studentcoin.model.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, Long> {}
