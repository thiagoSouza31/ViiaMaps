package com.example.viiamaps.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.viiamaps.repository.entity.Usuario;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    Usuario findByEmail(String email);
}
