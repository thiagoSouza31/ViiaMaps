package com.example.viiamaps.repository.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "estabelecimentos")
public class Estabelecimento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === DADOS BÁSICOS ===
    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 200)
    private String endereco;

    // === LOCALIZAÇÃO ===
    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    // === CONTATO ===
    @Column(length = 20)
    private String telefone;

    // === MÍDIA PRINCIPAL ===
    @Column(columnDefinition = "TEXT")
    private String imagemCapa;

    // === AVALIAÇÃO ===
    private Double rating;

    private Integer totalReviews;

    // === RELAÇÕES FUTURAS ===
    @OneToMany(mappedBy = "estabelecimento", cascade = CascadeType.ALL)
    private List<Avaliacao> avaliacoes;

    @OneToMany(mappedBy = "estabelecimento", cascade = CascadeType.ALL)
    private List<Acessibilidade> acessibilidades;

    public Estabelecimento() {}

    public Estabelecimento(
            String nome,
            String endereco,
            Double latitude,
            Double longitude,
            String telefone,
            String imagemCapa
    ) {
        this.nome = nome;
        this.endereco = endereco;
        this.latitude = latitude;
        this.longitude = longitude;
        this.telefone = telefone;
        this.imagemCapa = imagemCapa;
        this.rating = 0.0;
        this.totalReviews = 0;
    }

    // =========================
    // GETTERS E SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getImagemCapa() {
        return imagemCapa;
    }

    public void setImagemCapa(String imagemCapa) {
        this.imagemCapa = imagemCapa;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Integer totalReviews) {
        this.totalReviews = totalReviews;
    }

    public List<Avaliacao> getAvaliacoes() {
        return avaliacoes;
    }

    public void setAvaliacoes(List<Avaliacao> avaliacoes) {
        this.avaliacoes = avaliacoes;
    }

    public List<Acessibilidade> getAcessibilidades() {
        return acessibilidades;
    }

    public void setAcessibilidades(List<Acessibilidade> acessibilidades) {
        this.acessibilidades = acessibilidades;
    }
}