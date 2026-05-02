package com.example.demo.service;

import com.example.demo.model.Client;
import com.example.demo.model.Transaction;
import com.example.demo.repository.ClientRepository;
import com.example.demo.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    /**
     * Effectue un transfert immédiat entre deux clients.
     * Cette opération est transactionnelle : si une étape échoue, tout est annulé.
     */
    @Transactional
    public Map<String, Object> executeTransfer(String fromNum, String toNum, Double amount) {
        if (fromNum.equals(toNum)) {
            throw new RuntimeException("Impossible d'envoyer de l'argent à soi-même");
        }

        Client sender = clientRepository.findById(fromNum)
                .orElseThrow(() -> new RuntimeException("Expéditeur introuvable"));

        Client receiver = clientRepository.findById(toNum)
                .orElseThrow(() -> new RuntimeException("Destinataire introuvable"));

        if (sender.getSolde() == null || sender.getSolde() < amount) {
            throw new RuntimeException("Solde insuffisant pour effectuer le transfert");
        }

        // Mise à jour des soldes
        sender.setSolde(sender.getSolde() - amount);
        receiver.setSolde((receiver.getSolde() != null ? receiver.getSolde() : 0.0) + amount);

        clientRepository.save(sender);
        clientRepository.save(receiver);

        // Enregistrement de l'historique pour l'expéditeur
        createHistory(sender, "TRANSFERT_SORTANT", amount, "Envoi vers " + toNum, "COMPLETED");

        // Enregistrement de l'historique pour le destinataire
        createHistory(receiver, "TRANSFERT_ENTRANT", amount, "Réception de " + fromNum, "COMPLETED");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Transfert effectué avec succès");
        response.put("nouveauSolde", sender.getSolde());
        return response;
    }

    /**
     * Effectue un dépôt direct sur le compte d'un client.
     */
    @Transactional
    public Client executeDeposit(String numtel, Double amount) {
        Client client = clientRepository.findById(numtel)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        client.setSolde((client.getSolde() != null ? client.getSolde() : 0.0) + amount);
        Client updatedClient = clientRepository.save(client);

        createHistory(updatedClient, "DEPOT", amount, "Dépôt d'argent sur le compte", "COMPLETED");

        return updatedClient;
    }

    /**
     * Prépare une demande de retrait qui sera validée par l'admin.
     * Le solde n'est pas encore débité ici.
     */
    @Transactional
    public Map<String, Object> requestWithdrawal(String numtel, Double amount) {
        Client client = clientRepository.findById(numtel)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));

        if (client.getSolde() < amount) {
            throw new RuntimeException("Solde insuffisant pour cette demande");
        }

        // On crée une transaction avec le statut PENDING
        createHistory(client, "RETRAIT", amount, "Demande de retrait en attente", "PENDING");

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Demande enregistrée et en attente de validation admin");
        return response;
    }

    /**
     * Méthode utilitaire interne pour créer une entrée dans l'historique.
     */
    private void createHistory(Client client, String type, Double montant, String description, String statut) {
        Transaction tx = new Transaction();
        tx.setClient(client);
        tx.setType(type);
        tx.setMontant(montant);
        tx.setDescription(description);
        tx.setStatut(statut);
        tx.setDate(LocalDateTime.now());
        transactionRepository.save(tx);
    }
}