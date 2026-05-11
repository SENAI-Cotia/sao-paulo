package com.entrenos.controller;

import com.entrenos.model.Aluno;
import com.entrenos.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;

@Controller
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    // Redireciona raiz para o login
    @GetMapping("/")
    public String index(HttpSession session) {
        String tipo = (String) session.getAttribute("tipo");
        if ("psicologa".equals(tipo)) return "redirect:/psicologa";
        if ("aluno".equals(tipo)) return "redirect:/home";
        return "redirect:/login";
    }

    // Exibe a tela de login
    @GetMapping("/login")
    public String exibirLogin(HttpSession session) {
        String tipo = (String) session.getAttribute("tipo");
        if ("psicologa".equals(tipo)) return "redirect:/psicologa";
        if ("aluno".equals(tipo)) return "redirect:/home";
        return "LoginPage";
    }

    // Processa o login
    @PostMapping("/login")
    public String autenticar(
            @RequestParam String email,
            @RequestParam String senha,
            @RequestParam(defaultValue = "aluno") String tipo,
            HttpSession session,
            RedirectAttributes redirectAttributes) {

        Optional<Aluno> usuarioOpt = alunoRepository.findByEmail(email);

        if (usuarioOpt.isPresent()) {
            Aluno usuario = usuarioOpt.get();

            if (usuario.getSenha().equals(senha)) {

                if ("psicologa".equals(tipo)) {
                    if ("psicologa@entrenos.com".equals(email)) {
                        session.setAttribute("tipo", "psicologa");
                        session.setAttribute("nomeUsuario", usuario.getNome());
                        return "redirect:/psicologa";
                    } else {
                        redirectAttributes.addFlashAttribute("mensagemErro", "Este e-mail não tem permissão de psicóloga.");
                        return "redirect:/login";
                    }
                }

                session.setAttribute("tipo", "aluno");
                session.setAttribute("nomeUsuario", usuario.getNome());
                return "redirect:/home";
            }
        }

        redirectAttributes.addFlashAttribute("mensagemErro", "E-mail ou senha inválidos.");
        return "redirect:/login";
    }

    // Tela home do aluno
    @GetMapping("/home")
    public String home(HttpSession session, Model model) {
        String tipo = (String) session.getAttribute("tipo");
        if (!"aluno".equals(tipo)) return "redirect:/login";

        model.addAttribute("nomeAluno", session.getAttribute("nomeUsuario"));
        return "HomePage";
    }

    // Tela da psicóloga
    @GetMapping("/psicologa")
    public String psicologa(HttpSession session, Model model) {
        String tipo = (String) session.getAttribute("tipo");
        if (!"psicologa".equals(tipo)) return "redirect:/login";

        model.addAttribute("alunos", alunoRepository.findAll());
        return "Psicologa";
    }

    // Logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    // Cadastro
    @GetMapping("/cadastro")
    public String exibirCadastro(Model model) {
        model.addAttribute("aluno", new Aluno());
        return "cadastro";
    }

    @PostMapping("/salvar")
    public String salvar(@ModelAttribute Aluno aluno, RedirectAttributes redirectAttributes) {
        if (aluno.getEmail().trim().isEmpty() || aluno.getNome().trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Informe um email e o nome do aluno");
            return "redirect:/cadastro";
        }

        Optional<Aluno> alunoComMesmoEmail = alunoRepository.findByEmail(aluno.getEmail());
        if (alunoComMesmoEmail.isPresent()) {
            redirectAttributes.addFlashAttribute("mensagemEmail", "E-mail já está cadastrado");
            return "redirect:/cadastro";
        }

        alunoRepository.save(aluno);
        redirectAttributes.addFlashAttribute("mensagemSucesso", "Aluno cadastrado com sucesso!");
        return "redirect:/cadastro";
    }
}