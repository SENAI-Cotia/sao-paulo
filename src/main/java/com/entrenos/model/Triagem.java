package com.entrenos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tb_triagem")
public class Triagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int pontuacao;

    @Column(nullable = false)
    private String classificacao;

    public Triagem(Long id, int pontuacao, String classificacao) {
        this.id = id;
        this.pontuacao = pontuacao;
        this.classificacao = classificacao;
    }

    public Triagem() {
    }

    // GETTERS e SETTERS
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPontuacao() {
        return pontuacao;
    }

    public void setPontuacao(int pontuacao) {
        this.pontuacao = pontuacao;
    }

    public String getClassificacao() {
        return classificacao;
    }

    public void setClassificacao(String classificacao) {
        this.classificacao = classificacao;
    }
}