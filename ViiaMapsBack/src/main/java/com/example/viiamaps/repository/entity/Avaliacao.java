package com.example.viiamaps.repository.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "avaliacoes")
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String autor;

    @Column(nullable = false)
    private Integer nota;

    @Column(name = "data_avaliacao", nullable = false)
    private LocalDate dataAvaliacao;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    // === ACESSIBILIDADE REPORTADA PELO USUÁRIO ===
    @Column(nullable = false)
    private boolean cadeiraDeRodas;

    @Column(nullable = false)
    private boolean banheiroComAcessibilidade;

    @Column(nullable = false)
    private boolean menuBraile;

    @Column(nullable = false)
    private boolean linguagemDeSinal;

    @Column(nullable = false)
    private boolean estacionamentoPreferencial;

    @Column(nullable = false)
    private boolean elevador;

    @Column(nullable = false)
    private boolean pisoTatil;

    @ManyToOne
    @JoinColumn(name = "usuarios_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "estabelecimentos_id", nullable = false)
    private Estabelecimento estabelecimento;

    public Avaliacao() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public LocalDate getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(LocalDate dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public boolean isCadeiraDeRodas() { return cadeiraDeRodas; }
    public void setCadeiraDeRodas(boolean v) { this.cadeiraDeRodas = v; }

    public boolean isBanheiroComAcessibilidade() { return banheiroComAcessibilidade; }
    public void setBanheiroComAcessibilidade(boolean v) { this.banheiroComAcessibilidade = v; }

    public boolean isMenuBraile() { return menuBraile; }
    public void setMenuBraile(boolean v) { this.menuBraile = v; }

    public boolean isLinguagemDeSinal() { return linguagemDeSinal; }
    public void setLinguagemDeSinal(boolean v) { this.linguagemDeSinal = v; }

    public boolean isEstacionamentoPreferencial() { return estacionamentoPreferencial; }
    public void setEstacionamentoPreferencial(boolean v) { this.estacionamentoPreferencial = v; }

    public boolean isElevador() { return elevador; }
    public void setElevador(boolean v) { this.elevador = v; }

    public boolean isPisoTatil() { return pisoTatil; }
    public void setPisoTatil(boolean v) { this.pisoTatil = v; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Estabelecimento getEstabelecimento() { return estabelecimento; }
    public void setEstabelecimento(Estabelecimento estabelecimento) { this.estabelecimento = estabelecimento; }
}
