package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ce nom d'utilisateur est déjà utilisé."));
        }
        
        if (user.getEmail() != null) {
            // Ataovy soratra kely foana ny email alohan'ny hitahiry azy
            user.setEmail(user.getEmail().trim().toLowerCase());
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cet email est déjà enregistré."));
            }
        }

        try {
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(Map.of(
                "message", "Compte créé avec succès.", 
                "username", savedUser.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Une erreur est survenue lors de l'inscription."));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String loginIdent = body.get("login") != null ? body.get("login").trim() : "";
        String password = body.get("password");

        // 1. Mitady amin'ny Username aloha
        Optional<User> userOpt = userRepository.findByUsername(loginIdent);
        
        // 2. Raha tsy hita amin'ny username, vao mitady amin'ny email (atao lowercase)
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(loginIdent.toLowerCase());
        }

        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            
            String otpCode = String.valueOf(new Random().nextInt(9000) + 1000);

            // Fanamarinana ny email: trim() mba hanalana space mety tsy hitan'ny maso
            String userEmail = (user.getEmail() != null) ? user.getEmail().trim() : null;

            if (userEmail != null && !userEmail.isEmpty()) {
                try {
                    // Ity no mandefa ny mailaka ho an'ny rehetra (ADMIN na USER)
                    emailService.sendVerificationCode(userEmail, otpCode);
                } catch (Exception e) {
                    // Raha misy fahadisoana eto dia jereo ny Log SMTP (App Password, sns)
                    System.out.println("Erreur SMTP: " + e.getMessage());
                    return ResponseEntity.internalServerError().body(Map.of("error", "Échec de l'envoi de l'email. Vérifiez votre config SMTP."));
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Authentification réussie. Veuillez vérifier votre email.");
            response.put("username", user.getUsername());
            response.put("email", userEmail);
            response.put("role", user.getRole());
            response.put("otp", otpCode); 
            
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("error", "Identifiants invalides."));
    }

    @PostMapping("/send-access-code")
    public ResponseEntity<?> sendAccessCode(@RequestBody Map<String, String> body) {
        String email = body.get("email") != null ? body.get("email").trim().toLowerCase() : "";

        if (email.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "L'adresse email est requise."));
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String otpCode = String.valueOf(new Random().nextInt(9000) + 1000);

            try {
                emailService.sendVerificationCode(user.getEmail().trim(), otpCode);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Le code de sécurité a été envoyé.");
                response.put("otp", otpCode); 
                
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body(Map.of("error", "Erreur réseau lors de l'envoi."));
            }
        }

        return ResponseEntity.status(404).body(Map.of("error", "Utilisateur non trouvé."));
    }

   @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email") != null ? body.get("email").trim().toLowerCase() : "";
        String receivedOtp = body.get("otp");
        String sentOtp = body.get("sentOtp");

        if (email.isEmpty() || receivedOtp == null || sentOtp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Données incomplètes."));
        }

        if (receivedOtp.equals(sentOtp)) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                
                response.put("success", true);
                response.put("message", "Vérification réussie.");
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                response.put("redirect", "/dashboard");
                
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Code de vérification incorrect."));
    }
}