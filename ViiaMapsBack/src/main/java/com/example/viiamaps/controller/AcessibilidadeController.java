package com.example.viiamaps.controller;

import com.example.viiamaps.Service.AcessibilidadeService;
import com.example.viiamaps.repository.entity.Acessibilidade;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/acessiblidade")
public class AcessibilidadeController {
    private final AcessibilidadeService service;

    public AcessibilidadeController(AcessibilidadeService service) {
        this.service = service;
    }

    @GetMapping("/todos")
    public List<Acessibilidade> GetAll(){
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Acessibilidade> GetById(@PathVariable Long id){
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/novo")
    public Acessibilidade create(@RequestBody Acessibilidade acessibilidade){
        return service.save(acessibilidade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Acessibilidade> upadete(@PathVariable Long id,@RequestBody Acessibilidade acessibilidade){
        return service.findById(id).map(existing ->  {
            existing.setCadeiraDeRodas(acessibilidade.isCadeiraDeRodas());
            existing.setBanheiroComAcessibilidade(acessibilidade.isBanheiroComAcessibilidade());
            existing.setMenuBraile(acessibilidade.isMenuBraile());
            existing.setLinguagemDeSinal(acessibilidade.isLinguagemDeSinal());
            existing.setEstacionamentoPreferencial(acessibilidade.isEstacionamentoPreferencial());
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        return service.findById(id).map(existing -> {
            service.delete(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }




}
