package com.example.demo.controller;

import com.example.demo.model.Client;
import com.example.demo.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/all")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    // Raha numtel no ID-nao ao amin'ny repository
    @GetMapping("/{numtel}")
    public ResponseEntity<?> getClientByNum(@PathVariable String numtel) {
        return clientRepository.findById(numtel)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addClient(@RequestBody Client client) {
        // Hamarino raha efa misy ny ID (numtel)
        if (client.getNumtel() != null && clientRepository.existsById(client.getNumtel())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Ce numéro de téléphone existe déjà."));
        }
        
        try {
            // Mampiasa Integer (Object) fa tsy int (primitive) mba hahafahana manao check null
            if (client.getSolde() == 0) { 
                client.setSolde(0);
            }
            Client savedClient = clientRepository.save(client);
            return ResponseEntity.ok(Map.of("success", true, "message", "Client ajouté avec succès", "data", savedClient));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur lors de l'ajout : " + e.getMessage()));
        }
    }

    @PutMapping("/update/{numtel}")
    public ResponseEntity<?> updateClient(@PathVariable String numtel, @RequestBody Client clientDetails) {
        return clientRepository.findById(numtel)
                .map(client -> {
                    client.setNom(clientDetails.getNom());
                    client.setSexe(clientDetails.getSexe());
                    client.setAge(clientDetails.getAge());
                    client.setMail(clientDetails.getMail());
                    // Azonao ampiana eto ny fanovàna solde raha ilaina
                    clientRepository.save(client);
                    return ResponseEntity.ok(Map.of("success", true, "message", "Client mis à jour !"));
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Client non trouvé")));
    }

    @DeleteMapping("/delete/{numtel}")
    public ResponseEntity<?> deleteClient(@PathVariable String numtel) {
        return clientRepository.findById(numtel)
                .map(client -> {
                    try {
                        clientRepository.delete(client);
                        return ResponseEntity.ok(Map.of("success", true, "message", "Client supprimé !"));
                    } catch (Exception e) {
                        return ResponseEntity.internalServerError().body(Map.of("error", "Impossible de supprimer ce client."));
                    }
                })
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Client non trouvé")));
    }
}