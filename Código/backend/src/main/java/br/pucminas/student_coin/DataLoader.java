package br.pucminas.student_coin;

import br.pucminas.student_coin.model.InstituicaoEnsino;
import br.pucminas.student_coin.model.Professor;
import br.pucminas.student_coin.repository.InstituicaoEnsinoRepository;
import br.pucminas.student_coin.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private InstituicaoEnsinoRepository instituicaoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Override
    public void run(String... args) throws Exception {
        // A lógica só roda se não houver nenhuma instituição cadastrada,
        // para não duplicar dados a cada reinicialização do servidor.
        if (instituicaoRepository.count() == 0) {
            System.out.println(">>> Carregando dados iniciais no banco...");

            // 1. Criar e salvar as Instituições de Ensino
            InstituicaoEnsino puc = new InstituicaoEnsino();
            puc.setNome("PUC Minas");

            InstituicaoEnsino ufmg = new InstituicaoEnsino();
            ufmg.setNome("UFMG");

            instituicaoRepository.saveAll(Arrays.asList(puc, ufmg));
            System.out.println(">>> Instituições salvas!");

            // 2. Criar e salvar os Professores, associando-os às instituições
            Professor prof1 = new Professor();
            prof1.setNome("João Paulo Carneiro Aramuni");
            prof1.setEmail("joao.aramuni@email.com");
            prof1.setCpf("111.111.111-11");
            prof1.setSenha("prof123");
            prof1.setDepartamento("Ciência da Computação");
            prof1.setInstituicaoEnsino(puc); // Associa o professor à PUC Minas

            Professor prof2 = new Professor();
            prof2.setNome("Maria da Silva");
            prof2.setEmail("maria.silva@email.com");
            prof2.setCpf("222.222.222-22");
            prof2.setSenha("prof456");
            prof2.setDepartamento("Engenharia de Software");
            prof2.setInstituicaoEnsino(puc); // Associa a professora à PUC Minas

            Professor prof3 = new Professor();
            prof3.setNome("Carlos Andrade");
            prof3.setEmail("carlos.andrade@email.com");
            prof3.setCpf("333.333.333-33");
            prof3.setSenha("prof789");
            prof3.setDepartamento("Matemática");
            prof3.setInstituicaoEnsino(ufmg); // Associa o professor à UFMG
            
            professorRepository.saveAll(Arrays.asList(prof1, prof2, prof3));
            System.out.println(">>> Professores pré-cadastrados salvos!");
        }
    }
}
