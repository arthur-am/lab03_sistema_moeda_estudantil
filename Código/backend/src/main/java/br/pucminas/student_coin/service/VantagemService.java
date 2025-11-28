package br.pucminas.student_coin.service;

import br.pucminas.student_coin.model.Vantagem;
import br.pucminas.student_coin.repository.VantagemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VantagemService {

    @Autowired
    private VantagemRepository repository;

    public List<Vantagem> listarTodas() {
        return repository.findAll();
    }

    public Vantagem salvar(Vantagem vantagem) {
        return repository.save(vantagem);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}
