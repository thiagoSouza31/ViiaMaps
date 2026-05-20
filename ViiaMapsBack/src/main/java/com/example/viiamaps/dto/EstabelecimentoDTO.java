package com.example.viiamaps.dto;

public class EstabelecimentoDTO {

    private Long id;
    private String nome;
    private String endereco;
    private Double latitude;
    private Double longitude;
    private String telefone;
    private String imagemCapa;
    private Double rating;
    private Integer totalReviews;
    private AcessibilidadeDTO acessibilidade;

    public EstabelecimentoDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getImagemCapa() { return imagemCapa; }
    public void setImagemCapa(String imagemCapa) { this.imagemCapa = imagemCapa; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalReviews() { return totalReviews; }
    public void setTotalReviews(Integer totalReviews) { this.totalReviews = totalReviews; }

    public AcessibilidadeDTO getAcessibilidade() { return acessibilidade; }
    public void setAcessibilidade(AcessibilidadeDTO acessibilidade) { this.acessibilidade = acessibilidade; }
}
