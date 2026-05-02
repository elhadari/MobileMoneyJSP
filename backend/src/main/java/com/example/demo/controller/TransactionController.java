package com.example.demo.controller;

import com.example.demo.model.Client;
import com.example.demo.model.Envoi;
import com.example.demo.model.Retrait;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.EnvoiRepository;
import com.example.demo.repository.RetraitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    @Autowired
    private EnvoiRepository envoiRepository;

    @Autowired
    private RetraitRepository retraitRepository;

    @Autowired
    private ClientRepository clientRepository;

    // 1. Maka ny liste "PENDING" rehetra
    @GetMapping("/pending-tasks")
    public ResponseEntity<?> getPendingTasks() {
        Map<String, Object> tasks = new HashMap<>();
        tasks.put("envois", envoiRepository.findByStatut("PENDING"));
        tasks.put("retraits", retraitRepository.findByStatut("PENDING"));
        return ResponseEntity.ok(tasks);
    }

    // 2. Manaiky Retrait (Approve Retrait)
    @PostMapping("/approve-retrait/{id}")
    public ResponseEntity<?> approveRetrait(@PathVariable String id) {
        return retraitRepository.findById(id).map(retrait -> {
            Client client = clientRepository.findById(retrait.getNumtel()).orElse(null);
            if (client == null) return ResponseEntity.badRequest().body("Client non trouvé");

            // Eto vao tena manala vola
            if (client.getSolde() < retrait.getMontant()) {
                return ResponseEntity.badRequest().body("Solde insuffisant");
            }
            
            client.setSolde(client.getSolde() - retrait.getMontant());
            retrait.setStatut("COMPLETED");
            
            clientRepository.save(client);
            retraitRepository.save(retrait);
            return ResponseEntity.ok(Map.of("message", "Retrait effectué avec succès"));
        }).orElse(ResponseEntity.notFound().build());
    }

    // 3. Manaiky Envoi (Approve Envoi)
    @PostMapping("/approve-envoi/{id}")
    public ResponseEntity<?> approveEnvoi(@PathVariable String id) {
        return envoiRepository.findById(id).map(envoi -> {
            Client exp = clientRepository.findById(envoi.getNumEnvoyeur()).orElse(null);
            Client rec = clientRepository.findById(envoi.getNumRecepteur()).orElse(null);

            if (exp == null || rec == null) return ResponseEntity.badRequest().body("Expéditeur ou Récepteur non trouvé");

            // Analana ny any amin'ny nandefa, ampitomboina ny any amin'ny nandray
            exp.setSolde(exp.getSolde() - envoi.getMontant());
            rec.setSolde(rec.getSolde() + envoi.getMontant());

            envoi.setStatut("COMPLETED");

            clientRepository.save(exp);
            clientRepository.save(rec);
            envoiRepository.save(envoi);
            return ResponseEntity.ok(Map.of("message", "Transfert complété"));
        }).orElse(ResponseEntity.notFound().build());
    }
}