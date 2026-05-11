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

import java.util.Optional;

@Controller
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("alunos", alunoRepository.findAll());
        return "HomePage";
    }

    // Rota para a página de Login
    @GetMapping("/login")
    public String exibirLogin() {
        return "LoginPage";
    }

    // Rota para a página "Sobre Nós"
    @GetMapping("/sobre")
    public String sobreNos() {
        return "sobre";
    }

    // Rota para mostrar o formulário de cadastro
    @GetMapping("/cadastro")
    public String exibirCadastro(Model model) {
        model.addAttribute("aluno", new Aluno());
        return "cadastro";
    }

    @PostMapping("/login")
    public String autenticar(@RequestParam String email, @RequestParam String senha, RedirectAttributes redirectAttributes) {

        // Busca o aluno pelo e-mail
        Optional<Aluno> aluno = alunoRepository.findByEmail(email);

        if (aluno.isPresent()) {
            return "redirect:/";
        } else {
            redirectAttributes.addFlashAttribute("mensagemErro", "Usuário ou senha inválidos");
            return "redirect:/login";
        }
    }



    // Rota para receber os dados do formulário e salvar no banco
    @PostMapping("/salvar")
    public String salvar(@ModelAttribute Aluno aluno, RedirectAttributes redirectAttributes) {

        // Validação de campos vazios
        if (aluno.getEmail().trim().isEmpty() || aluno.getNome().trim().isEmpty()) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Informe um email e o nome do aluno");
            return "redirect:/cadastro";
        }
        // Verifica se o e-mail já existe
        Optional<Aluno> alunoComMesmoEmail = alunoRepository.findByEmail(aluno.getEmail());

        if (alunoComMesmoEmail.isPresent()) {
            redirectAttributes.addFlashAttribute("mensagemEmail", "E-mail já está cadastrado");
            return "redirect:/cadastro";
        }

        // Salva o aluno e redireciona com sucesso
        alunoRepository.save(aluno);
        redirectAttributes.addFlashAttribute("mensagemSucesso", "Aluno cadastrado com sucesso!");
        return "redirect:/cadastro";
    }
}