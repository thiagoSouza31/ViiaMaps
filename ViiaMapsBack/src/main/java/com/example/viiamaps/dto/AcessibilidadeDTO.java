package com.example.viiamaps.dto;

public class AcessibilidadeDTO {

    private boolean cadeiraDeRodas;
    private boolean banheiroComAcessibilidade;
    private boolean menuBraile;
    private boolean linguagemDeSinal;
    private boolean estacionamentoPreferencial;
    private boolean elevador;
    private boolean pisoTatil;

    public AcessibilidadeDTO() {}

    public boolean isCadeiraDeRodas() { return cadeiraDeRodas; }
    public void setCadeiraDeRodas(boolean cadeiraDeRodas) { this.cadeiraDeRodas = cadeiraDeRodas; }

    public boolean isBanheiroComAcessibilidade() { return banheiroComAcessibilidade; }
    public void setBanheiroComAcessibilidade(boolean banheiroComAcessibilidade) { this.banheiroComAcessibilidade = banheiroComAcessibilidade; }

    public boolean isMenuBraile() { return menuBraile; }
    public void setMenuBraile(boolean menuBraile) { this.menuBraile = menuBraile; }

    public boolean isLinguagemDeSinal() { return linguagemDeSinal; }
    public void setLinguagemDeSinal(boolean linguagemDeSinal) { this.linguagemDeSinal = linguagemDeSinal; }

    public boolean isEstacionamentoPreferencial() { return estacionamentoPreferencial; }
    public void setEstacionamentoPreferencial(boolean estacionamentoPreferencial) { this.estacionamentoPreferencial = estacionamentoPreferencial; }

    public boolean isElevador() { return elevador; }
    public void setElevador(boolean elevador) { this.elevador = elevador; }

    public boolean isPisoTatil() { return pisoTatil; }
    public void setPisoTatil(boolean pisoTatil) { this.pisoTatil = pisoTatil; }
}
