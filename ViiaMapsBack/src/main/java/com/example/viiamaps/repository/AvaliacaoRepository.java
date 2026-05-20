package com.example.viiamaps.repository;

import com.example.viiamaps.repository.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByEstabelecimentoId(Long estabelecimentoId);
    List<Avaliacao> findByUsuarioId(Long usuarioId);
    Optional<Avaliacao> findByUsuarioIdAndEstabelecimentoId(Long usuarioId, Long estabelecimentoId);
}
