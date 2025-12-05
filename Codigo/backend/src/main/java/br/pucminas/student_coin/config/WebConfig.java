package br.pucminas.student_coin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplica a configuração a todos os endpoints sob /api
            .allowedOrigins(
                "http://localhost:3000", // Para seu ambiente de desenvolvimento local
                "https://studentcoin.vercel.app" // SUA URL DE PRODUÇÃO DO FRONTEND
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos permitidos
            .allowedHeaders("*") // Permite todos os cabeçalhos
            .allowCredentials(true); // Permite o envio de credenciais (cookies, etc.)
    }
}
