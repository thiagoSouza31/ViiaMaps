package com.example.viiamaps.Service;


import com.example.viiamaps.repository.AcessibilidadeRepository;
import com.example.viiamaps.repository.entity.Acessibilidade;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AcessibilidadeService {
    private final AcessibilidadeRepository repository;

    public AcessibilidadeService(AcessibilidadeRepository repository) {this.repository = repository;}

    public List<Acessibilidade> findAll() {return repository.findAll();}
    public Optional<Acessibilidade> findById(Long id) {return repository.findById(id);}
    public Acessibilidade save(Acessibilidade acessibilidade) {return repository.save(acessibilidade); }
    public void delete(Long id) {repository.deleteById(id);}
}