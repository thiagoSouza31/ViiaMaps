package com.example.viiamaps.controller;

import com.example.viiamaps.Service.UsuarioService;
import com.example.viiamaps.dto.AlterarSenhaDTO;
import com.example.viiamaps.dto.AtualizarPerfilDTO;
import com.example.viiamaps.repository.entity.Usuario;
import com.example.viiamaps.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    private final UsuarioService service;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioService service,
                             BCryptPasswordEncoder passwordEncoder) {
        this.service = service;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/todos")
    public List<Usuario> getAll(){
        List<Usuario> usuarios = service.findAll();

        usuarios.forEach(u -> u.setSenha(null)); // 🔥 remove senha

        return usuarios;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/novo")
    public Usuario create(@RequestBody Usuario usuario) {
        System.out.println("Usuario novo: " + usuario);
        return service.save(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> update(@PathVariable Long id, @RequestBody Usuario usuario) {
        return service.findById(id).map(existing -> {
            existing.setNome(usuario.getNome());
            existing.setEmail(usuario.getEmail());
            if (usuario.getSenha() != null && !usuario.getSenha().isEmpty()) {
                existing.setSenha(passwordEncoder.encode(usuario.getSenha()));
            }
            return ResponseEntity.ok(service.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/foto")
    public ResponseEntity<?> atualizarFoto(@RequestBody Map<String, String> body) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = service.findByEmail(email);
        if (usuario == null) return ResponseEntity.status(404).body("Usuário não encontrado");

        String foto = body.get("foto");
        if (foto == null || foto.isBlank()) return ResponseEntity.badRequest().body("Foto inválida");
        // Base64 de 2MB de imagem ocupa ~2,73MB de string; limite de segurança no back
        if (foto.length() > 3_000_000) return ResponseEntity.badRequest().body("Foto muito grande. Máximo 2MB.");

        usuario.setFotoPerfil(foto);
        service.saveExisting(usuario);
        return ResponseEntity.ok(Map.of("fotoPerfil", foto));
    }

    @PatchMapping("/perfil")
    public ResponseEntity<?> atualizarPerfil(@RequestBody AtualizarPerfilDTO dto) {
        String emailAtual = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = service.findByEmail(emailAtual);
        if (usuario == null) return ResponseEntity.status(404).body("Usuário não encontrado");

        usuario.setNome(dto.getNome());
        usuario.setEmail(dto.getEmail());
        Usuario salvo = service.saveExisting(usuario);

        // Gera novo token com email atualizado — necessário se o email mudou
        String novoToken = JwtUtil.generateToken(salvo.getEmail());
        return ResponseEntity.ok(Map.of(
                "id", salvo.getId(),
                "nome", salvo.getNome(),
                "email", salvo.getEmail(),
                "token", novoToken
        ));
    }

    @PatchMapping("/senha")
    public ResponseEntity<?> alterarSenha(@RequestBody AlterarSenhaDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = service.findByEmail(email);
        if (usuario == null) return ResponseEntity.status(404).body("Usuário não encontrado");

        if (!passwordEncoder.matches(dto.getSenhaAtual(), usuario.getSenha())) {
            return ResponseEntity.status(400).body("Senha atual incorreta");
        }

        usuario.setSenha(passwordEncoder.encode(dto.getNovaSenha()));
        service.saveExisting(usuario);
        return ResponseEntity.ok("Senha alterada com sucesso");
    }

    @DeleteMapping("/conta")
    public ResponseEntity<?> excluirConta() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            service.deleteAccount(email);
            return ResponseEntity.ok("Conta excluída com sucesso");
        } catch (java.util.NoSuchElementException e) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.findById(id).map(existing -> {
            service.delete(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {

        Usuario usuarioEncontrado = service.findByEmail(usuario.getEmail());

        if (usuarioEncontrado == null) {
            return ResponseEntity.status(404).body("Usuário não encontrado");
        }

        if (!passwordEncoder.matches(usuario.getSenha(), usuarioEncontrado.getSenha())) {
            return ResponseEntity.status(401).body("Senha incorreta");
        }

        String token = JwtUtil.generateToken(usuarioEncontrado.getEmail());
        String foto = usuarioEncontrado.getFotoPerfil() != null ? usuarioEncontrado.getFotoPerfil() : "";
        return ResponseEntity.ok(Map.of(
                "token", token,
                "id", usuarioEncontrado.getId(),
                "nome", usuarioEncontrado.getNome(),
                "email", usuarioEncontrado.getEmail(),
                "fotoPerfil", foto
        ));
    }
}
