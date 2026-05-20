package com.example.viiamaps.controller;

import com.example.viiamaps.Service.EstabelecimentoService;
import com.example.viiamaps.dto.EstabelecimentoDTO;
import com.example.viiamaps.repository.entity.Estabelecimento;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estabelecimentos")
public class EstabelecimentoController {

    private final EstabelecimentoService service;

    public EstabelecimentoController(EstabelecimentoService service) {
        this.service = service;
    }

    @GetMapping("/todos")
    public List<EstabelecimentoDTO> getAll() {
        return service.findAllAsDTO();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Estabelecimento> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/novo")
    public Estabelecimento create(@RequestBody Estabelecimento estabelecimento) {
        return service.save(estabelecimento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Estabelecimento> update(@PathVariable Long id, @RequestBody Estabelecimento dados) {
        return service.findById(id).map(existing -> {
            existing.setNome(dados.getNome());
            existing.setEndereco(dados.getEndereco());
            existing.setImagemCapa(dados.getImagemCapa());
            existing.setTelefone(dados.getTelefone());
            existing.setLongitude(dados.getLongitude());
            existing.setLatitude(dados.getLatitude());
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.findById(id).map(existing -> {
            service.delete(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
