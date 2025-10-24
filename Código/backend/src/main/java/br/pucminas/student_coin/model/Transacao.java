package br.pucminas.student_coin.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Transacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long idOrigem; // Pode ser ID do Professor ou do Aluno
    private Long idDestino; // Pode ser ID do Aluno ou da Empresa
    private double valor;
    private String motivo; // Mensagem do professor ou nome da vantagem
    private LocalDateTime data = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private TipoTransacao tipo;

    public enum TipoTransacao {
        ENVIO,
        RESGATE
    }
}