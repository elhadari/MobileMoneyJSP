package com.example.demo.controller;

import com.example.demo.model.Envoi;
import com.example.demo.repository.EnvoiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/envoi")
@CrossOrigin(origins = "http://localhost:3000")
public class EnvoiController {

    @Autowired
    private EnvoiRepository envoiRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // 1. Récupérer tous les transferts (Admin)
    @GetMapping("/all")
    public List<Envoi> getAllEnvois() {
        return envoiRepository.findAll();
    }

    // 2. Récupérer un transfert par ID
    @GetMapping("/{id}")
    public Optional<Envoi> getEnvoiById(@PathVariable String id) {
        return envoiRepository.findById(id);
    }

    // 3. Ajout d'un nouveau transfert + Notification en temps réel
    @PostMapping("/add")
    public Envoi createEnvoi(@RequestBody Envoi envoi) {
        Envoi savedEnvoi = envoiRepository.save(envoi);

        // Notification envoyée au dashboard Admin
        String notificationMessage = String.format(
            "Nouveau transfert reçu : %d Ar de la part de %s", 
            savedEnvoi.getMontant(), 
            savedEnvoi.getNumEnvoyeur()
        );
        
        messagingTemplate.convertAndSend("/topic/admin-notifications", notificationMessage);

        return savedEnvoi;
    }

    // 4. Mise à jour d'un transfert
    @PutMapping("/update/{id}")
    public Envoi updateEnvoi(@PathVariable String id, @RequestBody Envoi envoiDetails) {
        return envoiRepository.findById(id).map(envoi -> {
            envoi.setNumEnvoyeur(envoiDetails.getNumEnvoyeur());
            envoi.setNumRecepteur(envoiDetails.getNumRecepteur());
            envoi.setMontant(envoiDetails.getMontant());
            envoi.setDate(envoiDetails.getDate());
            envoi.setPayerFraisRetrait(envoiDetails.getPayerFraisRetrait());
            envoi.setRaison(envoiDetails.getRaison());
            return envoiRepository.save(envoi);
        }).orElseGet(() -> {
            envoiDetails.setIdenv(id);
            return envoiRepository.save(envoiDetails);
        });
    }

    // 5. Suppression d'un transfert
    @DeleteMapping("/delete/{id}")
    public void deleteEnvoi(@PathVariable String id) {
        envoiRepository.deleteById(id);
    }
}