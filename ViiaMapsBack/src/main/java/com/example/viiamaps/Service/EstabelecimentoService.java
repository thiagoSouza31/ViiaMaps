package com.example.viiamaps.Service;

import com.example.viiamaps.dto.AcessibilidadeDTO;
import com.example.viiamaps.dto.EstabelecimentoDTO;
import com.example.viiamaps.repository.EstabelecimentoRepository;
import com.example.viiamaps.repository.entity.Avaliacao;
import com.example.viiamaps.repository.entity.Estabelecimento;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EstabelecimentoService {

    private final EstabelecimentoRepository repository;

    public EstabelecimentoService(EstabelecimentoRepository repository) {
        this.repository = repository;
    }

    public List<Estabelecimento> findAll() { return repository.findAll(); }
    public Optional<Estabelecimento> findById(Long id) { return repository.findById(id); }
    public Estabelecimento save(Estabelecimento estabelecimento) { return repository.save(estabelecimento); }
    public void delete(long id) { repository.deleteById(id); }

    @Transactional
    public List<EstabelecimentoDTO> findAllAsDTO() {
        return repository.findAll().stream().map(e -> {
            AcessibilidadeDTO ac = new AcessibilidadeDTO();

            // Agrega acessibilidade a partir das avaliações dos usuários
            List<Avaliacao> avaliacoes = e.getAvaliacoes();
            if (avaliacoes != null) {
                for (Avaliacao a : avaliacoes) {
                    if (a.isCadeiraDeRodas()) ac.setCadeiraDeRodas(true);
                    if (a.isBanheiroComAcessibilidade()) ac.setBanheiroComAcessibilidade(true);
                    if (a.isMenuBraile()) ac.setMenuBraile(true);
                    if (a.isLinguagemDeSinal()) ac.setLinguagemDeSinal(true);
                    if (a.isEstacionamentoPreferencial()) ac.setEstacionamentoPreferencial(true);
                    if (a.isElevador()) ac.setElevador(true);
                    if (a.isPisoTatil()) ac.setPisoTatil(true);
                }
            }

            EstabelecimentoDTO dto = new EstabelecimentoDTO();
            dto.setId(e.getId());
            dto.setNome(e.getNome());
            dto.setEndereco(e.getEndereco());
            dto.setLatitude(e.getLatitude());
            dto.setLongitude(e.getLongitude());
            dto.setTelefone(e.getTelefone());
            dto.setImagemCapa(e.getImagemCapa());
            dto.setRating(e.getRating() != null ? e.getRating() : 0.0);
            dto.setTotalReviews(e.getTotalReviews() != null ? e.getTotalReviews() : 0);
            dto.setAcessibilidade(ac);
            return dto;
        }).collect(Collectors.toList());
    }
}
