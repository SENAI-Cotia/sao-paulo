package com.entrenos.controller;

import com.entrenos.model.Agendamento;
import com.entrenos.model.Usuario; // Ajustado para a sua classe correta
import com.entrenos.repository.AgendamentoRepository;
import com.entrenos.repository.UsuarioRepository; // Injetando o seu repositório
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/calendario")
public class AgendamentoController {

    @Autowired
    private AgendamentoRepository repository;

    @Autowired
    private UsuarioRepository usuarioRepository; // Modificado aqui

    @GetMapping
    public String exibirCalendario(Model model, Principal principal) {
        List<Agendamento> todosAgendamentos = repository.findAll();

        DateTimeFormatter formatadorData = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter formatadorHora = DateTimeFormatter.ofPattern("HH:mm:ss");

        List<String> horariosBloqueados = todosAgendamentos.stream()
                .map(agenda -> {
                    String dataStr = agenda.getData().format(formatadorData);
                    String horaStr = agenda.getHora().format(formatadorHora);
                    return dataStr + " " + horaStr;
                })
                .collect(Collectors.toList());

        model.addAttribute("datasIndisponiveis", horariosBloqueados);

        if (principal != null) {
            Usuario usuario = usuarioRepository.findByEmail(principal.getName()).orElse(null);
            if (usuario != null) {
                model.addAttribute("nomeAluno", usuario.getNome()); // Passa o nome para o Thymeleaf
            }
        }

        return "HomePage";
    }

    @PostMapping("/agendar")
    @ResponseBody
    public String salvarAgendamento(@RequestBody Map<String, String> dados, Principal principal) {
        try {
            if (principal == null) {
                return "{\"status\": \"erro\", \"mensagem\": \"Sessão expirada. Faça login novamente.\"}";
            }

            String emailLogado = principal.getName();
            Usuario usuario = usuarioRepository.findByEmail(emailLogado)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado no sistema."));

            long agendamentosDesteUsuario = repository.countByUsuarioEmail(emailLogado);
            if (agendamentosDesteUsuario > 0) {
                return "{\"status\": \"limite_atingido\", \"mensagem\": \"Você já possui um agendamento ativo.\"}";
            }

            LocalDate data = LocalDate.parse(dados.get("data"));
            LocalTime hora = LocalTime.parse(dados.get("hora"));

            boolean jaExiste = repository.existsByDataAndHora(data, hora);
            if (jaExiste) {
                return "{\"status\": \"erro\", \"mensagem\": \"Erro! Esse horário já está agendado por outro usuário.\"}";
            }

            Agendamento novoAgendamento = new Agendamento(data, hora);
            novoAgendamento.setUsuario(usuario); // Certifique-se de que sua model Agendamento possui o método setUsuario(Usuario u)

            repository.save(novoAgendamento);

            return "{\"status\": \"sucesso\"}";
        } catch (Exception e) {
            return "{\"status\": \"erro\", \"mensagem\": \"" + e.getMessage() + "\"}";
        }
    }

    @GetMapping("/meu-agendamento")
    @ResponseBody
    public ResponseEntity<List<Agendamento>> getMeuAgendamento(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).build();
        }

        String emailLogado = principal.getName();

        List<Agendamento> agendamentos = repository.findByUsuarioEmail(emailLogado);

        return ResponseEntity.ok(agendamentos);
    }

    @DeleteMapping("/cancelar/{id}")
    @ResponseBody
    public String cancelarAgendamento(@PathVariable Long id) {
        try {
            repository.deleteById(id);
            return "{\"status\": \"sucesso\", \"mensagem\": \"Agendamento removido com sucesso!\"}";
        } catch (Exception e) {
            return "{\"status\": \"erro\", \"mensagem\": \"Erro ao processar: " + e.getMessage() + "\"}";
        }
    }
}