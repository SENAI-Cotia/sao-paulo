package com.entrenos.controller;

import com.entrenos.model.Usuario;
import com.entrenos.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AlunoController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AlunoController(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/home")
    public String home(Authentication auth, Model model) {
        if (auth != null && auth.isAuthenticated()) {
            usuarioRepository.findByEmail(auth.getName()).ifPresent(usuario ->
                    model.addAttribute("nomeAluno", usuario.getNome())
            );
        }
        return "HomePage";
    }

    @GetMapping("/cadastro")
    public String exibirCadastro(Model model) {
        model.addAttribute("aluno", new Usuario());
        return "CadastroPage";
    }

    @PostMapping("/salvar")
    public String salvar(
            @ModelAttribute Usuario usuario,
            @RequestParam(required = false) String tipoPerfil,
            @RequestParam(required = false) String codigoPsicologo,
            RedirectAttributes redirectAttributes) {

        if (usuario.getEmail().isBlank() || usuario.getNome().isBlank()) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Informe nome e e-mail.");
            return "redirect:/cadastro";
        }

        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            redirectAttributes.addFlashAttribute("mensagemEmail", "E-mail já cadastrado.");
            return "redirect:/cadastro";
        }

        if ("psicologo".equals(tipoPerfil)) {
            if (codigoPsicologo == null || !codigoPsicologo.equals("PSI2026")) {
                redirectAttributes.addFlashAttribute("mensagemErro", "Código de psicólogo inválido.");
                return "redirect:/cadastro";
            }
            usuario.setRole("ROLE_PSICOLOGO");
        } else {
            usuario.setRole("ROLE_ALUNO");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioRepository.save(usuario);

        redirectAttributes.addFlashAttribute("mensagemSucesso", "Cadastro realizado com sucesso!");
        return "redirect:/cadastro";
    }
}