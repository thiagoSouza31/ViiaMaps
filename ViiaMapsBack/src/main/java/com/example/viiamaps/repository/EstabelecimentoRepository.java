package com.example.viiamaps.repository;

import com.example.viiamaps.repository.entity.Estabelecimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstabelecimentoRepository extends JpaRepository<Estabelecimento, Long> {
    boolean existsByNome(String nome);
    Optional<Estabelecimento> findByNome(String nome);
}