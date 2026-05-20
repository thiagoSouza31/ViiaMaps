package com.example.viiamaps.Service;

import com.example.viiamaps.repository.AvaliacaoRepository;
import com.example.viiamaps.repository.EstabelecimentoRepository;
import com.example.viiamaps.repository.UsuarioRepository;
import com.example.viiamaps.repository.entity.Avaliacao;
import com.example.viiamaps.repository.entity.Estabelecimento;
import com.example.viiamaps.repository.entity.Usuario;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {
    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AvaliacaoRepository avaliacaoRepository;
    private final EstabelecimentoRepository estabelecimentoRepository;

    public UsuarioService(UsuarioRepository repository,
                          BCryptPasswordEncoder passwordEncoder,
                          AvaliacaoRepository avaliacaoRepository,
                          EstabelecimentoRepository estabelecimentoRepository) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.avaliacaoRepository = avaliacaoRepository;
        this.estabelecimentoRepository = estabelecimentoRepository;
    }

    public List<Usuario> findAll() { return repository.findAll(); }
    public Optional<Usuario> findById(Long id) { return repository.findById(id); }

    public Usuario save(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return repository.save(usuario);
    }

    public Usuario saveExisting(Usuario usuario) {
        return repository.save(usuario);
    }

    public void delete(Long id) { repository.deleteById(id); }

    public Usuario findByEmail(String email) { return repository.findByEmail(email); }

    @Transactional
    public void deleteAccount(String email) {
        Usuario usuario = repository.findByEmail(email);
        if (usuario == null) throw new NoSuchElementException("Usuário não encontrado");

        List<Avaliacao> avaliacoes = avaliacaoRepository.findByUsuarioId(usuario.getId());

        List<Long> estabelecimentosAfetados = avaliacoes.stream()
                .map(a -> a.getEstabelecimento().getId())
                .distinct()
                .collect(Collectors.toList());

        // Deleta avaliações explicitamente antes do usuário para evitar violação de FK
        avaliacaoRepository.deleteAll(avaliacoes);
        avaliacaoRepository.flush();

        repository.delete(usuario);
        repository.flush();

        // Recalcula rating dos estabelecimentos afetados com as avaliações restantes
        for (Long estId : estabelecimentosAfetados) {
            List<Avaliacao> restantes = avaliacaoRepository.findByEstabelecimentoId(estId);
            double raw = restantes.isEmpty() ? 0.0
                    : restantes.stream().mapToInt(Avaliacao::getNota).average().orElse(0.0);
            final double rating = Math.round(raw * 10.0) / 10.0;

            estabelecimentoRepository.findById(estId).ifPresent(est -> {
                est.setRating(rating);
                est.setTotalReviews(restantes.size());
                estabelecimentoRepository.save(est);
            });
        }
    }
}