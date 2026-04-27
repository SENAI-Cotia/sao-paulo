package com.entrenos.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "tb_agendamento")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    private String status;

    public Agendamento(Long id, LocalDateTime dataHora, String status) {
        this.id = id;
        this.dataHora = dataHora;
        this.status = status;
    }

    public Agendamento() {
    }

    // GETTERS e SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataHora() {
        return dataHora;
    }

    public void setDataHora(LocalDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

