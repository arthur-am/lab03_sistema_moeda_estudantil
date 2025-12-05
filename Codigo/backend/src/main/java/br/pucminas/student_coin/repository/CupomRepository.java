package br.pucminas.student_coin.repository;

import br.pucminas.student_coin.model.Cupom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CupomRepository extends JpaRepository<Cupom, Long> {
    List<Cupom> findByAlunoId(Long alunoId);
}
