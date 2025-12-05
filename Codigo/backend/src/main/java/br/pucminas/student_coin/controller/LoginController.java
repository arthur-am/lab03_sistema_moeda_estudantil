package br.pucminas.student_coin.controller;

import br.pucminas.student_coin.model.Aluno;
import br.pucminas.student_coin.model.EmpresaParceira;
import br.pucminas.student_coin.model.Professor;
import br.pucminas.student_coin.repository.AlunoRepository;
import br.pucminas.student_coin.repository.EmpresaParceiraRepository;
import br.pucminas.student_coin.repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:3000") // ou a porta do seu frontend React
public class LoginController {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private EmpresaParceiraRepository empresaParceiraRepository;

    public record LoginRequest(String email, String senha) {}

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        // 1. Procurar o email no repositório de Aluno
        Optional<Aluno> alunoOptional = alunoRepository.findByEmail(request.email());
        if (alunoOptional.isPresent()) {
            Aluno aluno = alunoOptional.get();
            // Verifica se a senha corresponde (sem criptografia, para simplificar)
            if (aluno.getSenha().equals(request.senha())) {
                // Cria uma resposta estruturada para o frontend
                Map<String, Object> response = new HashMap<>();
                response.put("userType", "ALUNO");
                response.put("userData", aluno);
                return ResponseEntity.ok(response);
            }
        }

        // 2. Se não for aluno, procurar no repositório de Professor
        Optional<Professor> professorOptional = professorRepository.findByEmail(request.email());
        if (professorOptional.isPresent()) {
            Professor professor = professorOptional.get();
            if (professor.getSenha().equals(request.senha())) {
                Map<String, Object> response = new HashMap<>();
                response.put("userType", "PROFESSOR");
                response.put("userData", professor);
                return ResponseEntity.ok(response);
            }
        }

        // 3. Se não for professor, procurar no repositório de Empresa Parceira
        Optional<EmpresaParceira> empresaOptional = empresaParceiraRepository.findByEmail(request.email());
        if (empresaOptional.isPresent()) {
            EmpresaParceira empresa = empresaOptional.get();
            if (empresa.getSenha().equals(request.senha())) {
                Map<String, Object> response = new HashMap<>();
                response.put("userType", "EMPRESA");
                response.put("userData", empresa);
                return ResponseEntity.ok(response);
            }
        }

        // 4. Se não encontrar em nenhum ou a senha estiver errada, retorna erro 401
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
    }
}
