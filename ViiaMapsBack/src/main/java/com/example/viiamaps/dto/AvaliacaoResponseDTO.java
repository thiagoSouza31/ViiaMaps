package com.example.viiamaps.dto;

public class AvaliacaoResponseDTO {

    private Long id;
    private Long usuarioId;
    private String autor;
    private Integer nota;
    private String dataAvaliacao;
    private String comentario;
    private Long estabelecimentoId;
    private String nomeEstabelecimento;
    private String enderecoEstabelecimento;

    private boolean cadeiraDeRodas;
    private boolean banheiroComAcessibilidade;
    private boolean menuBraile;
    private boolean linguagemDeSinal;
    private boolean estacionamentoPreferencial;
    private boolean elevador;
    private boolean pisoTatil;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getAutor() { return autor; }
    public void setAutor(String autor) { this.autor = autor; }

    public Integer getNota() { return nota; }
    public void setNota(Integer nota) { this.nota = nota; }

    public String getDataAvaliacao() { return dataAvaliacao; }
    public void setDataAvaliacao(String dataAvaliacao) { this.dataAvaliacao = dataAvaliacao; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public Long getEstabelecimentoId() { return estabelecimentoId; }
    public void setEstabelecimentoId(Long estabelecimentoId) { this.estabelecimentoId = estabelecimentoId; }

    public String getNomeEstabelecimento() { return nomeEstabelecimento; }
    public void setNomeEstabelecimento(String nomeEstabelecimento) { this.nomeEstabelecimento = nomeEstabelecimento; }

    public String getEnderecoEstabelecimento() { return enderecoEstabelecimento; }
    public void setEnderecoEstabelecimento(String enderecoEstabelecimento) { this.enderecoEstabelecimento = enderecoEstabelecimento; }

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
