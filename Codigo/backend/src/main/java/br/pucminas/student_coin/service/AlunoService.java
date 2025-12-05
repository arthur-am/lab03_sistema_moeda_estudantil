package br.pucminas.student_coin.service;

import br.pucminas.student_coin.model.Aluno;
import br.pucminas.student_coin.model.Transacao;
import br.pucminas.student_coin.repository.AlunoRepository;
import br.pucminas.student_coin.repository.TransacaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlunoService {

    @Autowired
    private AlunoRepository alunoRepository;
    
    @Autowired
    private TransacaoRepository transacaoRepository;

    public List<Aluno> listarTodos() {
        return alunoRepository.findAll();
    }

    public Optional<Aluno> buscarPorId(Long id) {
        return alunoRepository.findById(id);
    }

    public Aluno salvar(Aluno aluno) {
        return alunoRepository.save(aluno);
    }

    public void deletar(Long id) {
        alunoRepository.deleteById(id);
    }

    public List<Transacao> getExtrato(Long alunoId) {
        return transacaoRepository.findByIdOrigemOrIdDestino(alunoId, alunoId);
    }
}
