package com.entrenos.model;

import jakarta.persistence.*; // ou javax.persistence.* dependendo da versão do seu Spring
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "agendamentos")
public class Agendamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate data;
    private LocalTime hora;
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Construtor padrão (obrigatório para o JPA)
    public Agendamento() {
    }

    // Seu construtor existente
    public Agendamento(LocalDate data, LocalTime hora) {
        this.data = data;
        this.hora = hora;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }

    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}