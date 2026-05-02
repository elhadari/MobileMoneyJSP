package com.example.demo.controller;

import com.example.demo.dto.DepositRequest;
import com.example.demo.dto.TransferRequest;
import com.example.demo.model.Client;
import com.example.demo.repository.ClientRepository;
import com.example.demo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:3000")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientService clientService;

    @GetMapping("/all")
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @GetMapping("/me/{email}")
    public ResponseEntity<?> getClientByEmail(@PathVariable String email) {
        return clientRepository.findByMail(email) // Utilisation de la méthode optimisée du Repository
                .map(client -> ResponseEntity.ok((Object) client))
                .orElseGet(() -> {
                    Map<String, String> error = new HashMap<>();
                    error.put("error", "Client non trouvé");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
                });
    }

    @PutMapping("/deposit")
    public ResponseEntity<?> deposit(@RequestBody DepositRequest request) {
        try {
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Montant invalide"));
            }
            Client updatedClient = clientService.executeDeposit(request.getNumtel(), request.getAmount());
            return ResponseEntity.ok(updatedClient);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody DepositRequest request) { // Utilise numtel et amount
        try {
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Montant invalide"));
            }
            Map<String, Object> response = clientService.requestWithdrawal(request.getNumtel(), request.getAmount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        try {
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Montant invalide"));
            }
            Map<String, Object> response = clientService.executeTransfer(
                request.getFrom(), 
                request.getTo(), 
                request.getAmount()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete/{numtel}")
    public ResponseEntity<?> deleteClient(@PathVariable String numtel) {
        return clientRepository.findById(numtel)
                .map(client -> {
                    clientRepository.delete(client);
                    return ResponseEntity.ok(Map.of("success", true));
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }
}