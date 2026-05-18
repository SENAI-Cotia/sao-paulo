package com.entrenos.controller;

import com.entrenos.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PsicologoController {

    private final UsuarioRepository usuarioRepository;

    public PsicologoController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/psicologo")
    public String dashboard(Authentication auth, Model model) {
        usuarioRepository.findByEmail(auth.getName()).ifPresent(usuario ->
                model.addAttribute("nomeUsuario", usuario.getNome())
        );
        model.addAttribute("usuarios", usuarioRepository.findAll());
        return "PsicologoPage";
    }
}