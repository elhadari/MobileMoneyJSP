package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom("elhadari04@gmail.com"); 
        message.setTo(toEmail);
        message.setSubject("Votre code YAS");
        
        String contenu = "Bonjour,\n\n" +
                        "Voici votre code de vérification : " + code + "\n\n" +
                        "Cordialement,\n" +
                        "L'équipe YAS.\n\n" +
                        "---\n" +
                        "Propulsé par Elysé RANDRIANANTENAINA"; 
        
        message.setText(contenu);
        
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Erreur d'envoi l'email: " + e.getMessage());
        }
    }
}