package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data 
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String type; // "DEPOSIT", "WITHDRAWAL", "TRANSFER"

    @Column(nullable = false)
    private Double montant;

    private String description;

    @Column(nullable = false)
    private String statut = "PENDING"; // Nampiana statut ho an'ny fankatoavan'ny admin

    @Column(nullable = false, updatable = false)
    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "client_numtel", nullable = false)
    private Client client;
    
    // Raha transfert no atao, mety mila recipient ianao:
    @Column(name = "recepteur_numtel")
    private String recepteurNumtel;
}