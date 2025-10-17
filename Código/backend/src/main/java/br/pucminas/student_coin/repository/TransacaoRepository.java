package br.pucminas.studentcoin.repository;

import br.pucminas.studentcoin.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    List<Transacao> findByIdOrigemOrIdDestino(Long idOrigem, Long idDestino);
}