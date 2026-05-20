package com.example.viiamaps.repository;

import com.example.viiamaps.repository.entity.Acessibilidade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcessibilidadeRepository extends JpaRepository<Acessibilidade,Long> {
}