package br.pucminas.student_coin;

import br.pucminas.student_coin.model.Aluno;
import br.pucminas.student_coin.model.InstituicaoEnsino;
import br.pucminas.student_coin.model.Professor;
import br.pucminas.student_coin.repository.AlunoRepository;
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

    @Autowired
    private AlunoRepository alunoRepository; // 1. Injetar o repositório do Aluno

    @Override
    public void run(String... args) throws Exception {
        // A lógica só roda se não houver nenhuma instituição cadastrada,
        // para não duplicar dados a cada reinicialização do servidor.
        if (instituicaoRepository.count() == 0) {
            System.out.println(">>> Carregando dados iniciais no banco...");

            // Criar e salvar as Instituições de Ensino
            InstituicaoEnsino puc = new InstituicaoEnsino();
            puc.setNome("PUC Minas");

            InstituicaoEnsino ufmg = new InstituicaoEnsino();
            ufmg.setNome("UFMG");

            instituicaoRepository.saveAll(Arrays.asList(puc, ufmg));
            System.out.println(">>> Instituições salvas!");

            // Criar e salvar os Professores, associando-os às instituições
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

            // 2. Criar e salvar um Aluno de teste
            Aluno aluno1 = new Aluno();
            aluno1.setNome("Ana Clara");
            aluno1.setEmail("ana.clara@aluno.com");
            aluno1.setCpf("444.444.444-44");
            aluno1.setRg("MG-12.345.678");
            aluno1.setEndereco("Rua Fictícia, 123");
            aluno1.setCurso("Sistemas de Informação");
            aluno1.setSenha("aluno123");
            aluno1.setSaldoMoedas(100.0); // Saldo inicial de moedas
            aluno1.setInstituicaoEnsino(puc); // Associa a aluna à PUC Minas

            alunoRepository.save(aluno1); // 3. Salvar o aluno no banco
            System.out.println(">>> Aluno de teste salvo!");
        }
    }
}