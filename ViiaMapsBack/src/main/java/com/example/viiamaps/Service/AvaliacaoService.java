package com.example.viiamaps.Service;

import com.example.viiamaps.dto.AvaliacaoDTO;
import com.example.viiamaps.dto.AvaliacaoResponseDTO;
import com.example.viiamaps.repository.AvaliacaoRepository;
import com.example.viiamaps.repository.EstabelecimentoRepository;
import com.example.viiamaps.repository.UsuarioRepository;
import com.example.viiamaps.repository.entity.Avaliacao;
import com.example.viiamaps.repository.entity.Estabelecimento;
import com.example.viiamaps.repository.entity.Usuario;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvaliacaoService {

    private final AvaliacaoRepository repository;
    private final EstabelecimentoRepository estabelecimentoRepository;
    private final UsuarioRepository usuarioRepository;

    public AvaliacaoService(AvaliacaoRepository repository,
                            EstabelecimentoRepository estabelecimentoRepository,
                            UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.estabelecimentoRepository = estabelecimentoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Optional<Avaliacao> findById(Long id) {
        return repository.findById(id);
    }

    public List<AvaliacaoResponseDTO> findByEstabelecimentoId(Long estabelecimentoId) {
        return repository.findByEstabelecimentoId(estabelecimentoId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public List<AvaliacaoResponseDTO> findByUsuarioId(Long usuarioId) {
        return repository.findByUsuarioId(usuarioId)
                .stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    public AvaliacaoResponseDTO save(AvaliacaoDTO dto, String emailAutenticado) {
        Estabelecimento est = estabelecimentoRepository.findById(dto.getEstabelecimentoId())
                .orElseThrow(() -> new NoSuchElementException("Estabelecimento não encontrado"));

        Usuario user = usuarioRepository.findByEmail(emailAutenticado);
        if (user == null) throw new NoSuchElementException("Usuário não encontrado: " + emailAutenticado);

        if (repository.findByUsuarioIdAndEstabelecimentoId(user.getId(), dto.getEstabelecimentoId()).isPresent()) {
            throw new IllegalStateException("Usuário já avaliou este estabelecimento");
        }

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setEstabelecimento(est);
        avaliacao.setUsuario(user);
        avaliacao.setAutor(user.getNome());
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario() != null ? dto.getComentario() : "");
        avaliacao.setDataAvaliacao(LocalDate.now());

        avaliacao.setCadeiraDeRodas(dto.isCadeiraDeRodas());
        avaliacao.setBanheiroComAcessibilidade(dto.isBanheiroComAcessibilidade());
        avaliacao.setMenuBraile(dto.isMenuBraile());
        avaliacao.setLinguagemDeSinal(dto.isLinguagemDeSinal());
        avaliacao.setEstacionamentoPreferencial(dto.isEstacionamentoPreferencial());
        avaliacao.setElevador(dto.isElevador());
        avaliacao.setPisoTatil(dto.isPisoTatil());

        Avaliacao saved = repository.save(avaliacao);
        updateEstabelecimentoRating(est.getId());

        return toResponseDTO(saved);
    }

    public AvaliacaoResponseDTO update(Long id, AvaliacaoDTO dto, String emailAutenticado) {
        Avaliacao avaliacao = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Avaliação não encontrada"));

        if (!avaliacao.getUsuario().getEmail().equals(emailAutenticado)) {
            throw new SecurityException("Você não tem permissão para editar esta avaliação");
        }

        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario() != null ? dto.getComentario() : "");
        avaliacao.setCadeiraDeRodas(dto.isCadeiraDeRodas());
        avaliacao.setBanheiroComAcessibilidade(dto.isBanheiroComAcessibilidade());
        avaliacao.setMenuBraile(dto.isMenuBraile());
        avaliacao.setLinguagemDeSinal(dto.isLinguagemDeSinal());
        avaliacao.setEstacionamentoPreferencial(dto.isEstacionamentoPreferencial());
        avaliacao.setElevador(dto.isElevador());
        avaliacao.setPisoTatil(dto.isPisoTatil());

        Avaliacao saved = repository.save(avaliacao);
        updateEstabelecimentoRating(avaliacao.getEstabelecimento().getId());
        return toResponseDTO(saved);
    }

    public void deleteWithOwnerCheck(Long id, String emailAutenticado) {
        Avaliacao avaliacao = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Avaliação não encontrada"));

        if (!avaliacao.getUsuario().getEmail().equals(emailAutenticado)) {
            throw new SecurityException("Você não tem permissão para excluir esta avaliação");
        }

        Long estabelecimentoId = avaliacao.getEstabelecimento().getId();
        repository.deleteById(id);
        updateEstabelecimentoRating(estabelecimentoId);
    }

    private void updateEstabelecimentoRating(Long estabelecimentoId) {
        List<Avaliacao> avaliacoes = repository.findByEstabelecimentoId(estabelecimentoId);

        int total = avaliacoes.size();
        double rating = total == 0 ? 0.0
                : avaliacoes.stream().mapToInt(Avaliacao::getNota).average().orElse(0.0);
        rating = Math.round(rating * 10.0) / 10.0;

        Estabelecimento est = estabelecimentoRepository.findById(estabelecimentoId)
                .orElseThrow(() -> new NoSuchElementException("Estabelecimento não encontrado"));
        est.setRating(rating);
        est.setTotalReviews(total);
        estabelecimentoRepository.save(est);
    }

    private AvaliacaoResponseDTO toResponseDTO(Avaliacao a) {
        AvaliacaoResponseDTO dto = new AvaliacaoResponseDTO();
        dto.setId(a.getId());
        dto.setUsuarioId(a.getUsuario().getId());
        dto.setAutor(a.getAutor());
        dto.setNota(a.getNota());
        dto.setDataAvaliacao(a.getDataAvaliacao() != null ? a.getDataAvaliacao().toString() : "");
        dto.setComentario(a.getComentario());
        dto.setEstabelecimentoId(a.getEstabelecimento().getId());
        dto.setNomeEstabelecimento(a.getEstabelecimento().getNome());
        dto.setEnderecoEstabelecimento(a.getEstabelecimento().getEndereco());
        dto.setCadeiraDeRodas(a.isCadeiraDeRodas());
        dto.setBanheiroComAcessibilidade(a.isBanheiroComAcessibilidade());
        dto.setMenuBraile(a.isMenuBraile());
        dto.setLinguagemDeSinal(a.isLinguagemDeSinal());
        dto.setEstacionamentoPreferencial(a.isEstacionamentoPreferencial());
        dto.setElevador(a.isElevador());
        dto.setPisoTatil(a.isPisoTatil());
        return dto;
    }
}
