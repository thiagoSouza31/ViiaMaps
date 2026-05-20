package com.example.viiamaps.dto;

public class AvaliacaoDTO {

    private Long usuarioId;
    private Long estabelecimentoId;
    private Integer nota;
    private String comentario;

    private boolean cadeiraDeRodas;
    private boolean banheiroComAcessibilidade;
    private boolean menuBraile;
    private boolean linguagemDeSinal;
    private boolean estacionamentoPreferencial;
    private boolean elevador;
    private boolean pisoTatil;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Long getEstabelecimentoId() { return estabelecimentoId; }
    public void setEstabelecimentoId(Long estabelecimentoId) { this.estabelecimentoId = estabelecimentoId; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

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
}
