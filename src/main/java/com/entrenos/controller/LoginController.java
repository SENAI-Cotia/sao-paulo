package com.entrenos.controller;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String exibirLogin() {
        return "LoginPage";
    }

    @GetMapping("/")
    public String index(Authentication auth) {
        if (auth != null && auth.isAuthenticated()) {
            boolean isPsicologo = auth.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_PSICOLOGO"));
            return isPsicologo ? "redirect:/psicologo" : "redirect:/home";
        }
        return "redirect:/login";
    }
}