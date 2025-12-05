package br.pucminas.student_coin.repository;

import br.pucminas.student_coin.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByIdOrigemOrIdDestino(Long idOrigem, Long idDestino);
    List<Transacao> findByIdOrigem(Long idOrigem);
}