package com.example.viiamaps.controller;

import com.example.viiamaps.Service.AvaliacaoService;
import com.example.viiamaps.dto.AvaliacaoDTO;
import com.example.viiamaps.dto.AvaliacaoResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/avaliacao")
public class AvaliacaoController {

    private final AvaliacaoService service;

    public AvaliacaoController(AvaliacaoService service) {
        this.service = service;
    }

    @GetMapping("/estabelecimento/{id}")
    public List<AvaliacaoResponseDTO> getByEstabelecimento(@PathVariable Long id) {
        return service.findByEstabelecimentoId(id);
    }

    @GetMapping("/usuario/{id}")
    public List<AvaliacaoResponseDTO> getByUsuario(@PathVariable Long id) {
        return service.findByUsuarioId(id);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AvaliacaoDTO dto) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            AvaliacaoResponseDTO saved = service.save(dto, email);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AvaliacaoDTO dto) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            AvaliacaoResponseDTO updated = service.update(id, dto, email);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        try {
            service.deleteWithOwnerCheck(id, email);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
}
