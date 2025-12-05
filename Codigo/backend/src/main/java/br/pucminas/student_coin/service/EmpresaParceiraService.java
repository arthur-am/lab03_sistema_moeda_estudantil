package br.pucminas.student_coin.service;

import br.pucminas.student_coin.model.EmpresaParceira;
import br.pucminas.student_coin.repository.EmpresaParceiraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpresaParceiraService {

    @Autowired
    private EmpresaParceiraRepository repository;

    public EmpresaParceira salvar(EmpresaParceira empresa) {
        // 1. Verifica se o campo CNPJ não está vazio
        if (empresa.getCnpj() == null || empresa.getCnpj().trim().isEmpty()) {
            throw new RuntimeException("O campo CNPJ é obrigatório.");
        }
        
        // 2. Usa o novo método do repositório para verificar a duplicidade
        if (repository.existsByCnpj(empresa.getCnpj())) {
            // Lança uma exceção se o CNPJ já estiver em uso
            throw new RuntimeException("Já existe uma empresa cadastrada com este CNPJ.");
        }

        // Se passar nas validações, salva a nova empresa no banco
        return repository.save(empresa);
    }
}
