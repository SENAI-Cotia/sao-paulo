package com.entrenos.controller;

import com.entrenos.model.Aluno;
import com.entrenos.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping("/")
    public String index() {
        return "HomePage";
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

    // Rota para receber os dados do formulário e salvar no banco
    @PostMapping("/salvar")
    public String salvarAluno(Aluno aluno) {
        alunoRepository.save(aluno);
        return "redirect:/";
    }
}