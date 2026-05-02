package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "envoi")
public class Envoi {
    
    @Id
    @Column(name = "idenv", length = 10)
    private String idenv;

    // Ampiasaina ny @ManyToOne raha te-haka ny mombamomba ny client ianao
    // Fa raha ny laharana fotsiny dia ampy ny String toy ny nataonao
    @Column(name = "numenvoyeur", length = 15)
    private String numEnvoyeur;

    @Column(name = "numrecepteur", length = 15)
    private String numRecepteur;

    private Integer montant;
    
    private LocalDate date;

    @Column(name = "payer_frais_retrait")
    private Boolean payerFraisRetrait;

    @Column(length = 255)
    private String raison;

    // --- SAHA VAOVAO ---
    @Column(name = "statut", length = 20)
    private String statut = "PENDING"; // "PENDING", "COMPLETED", "REJECTED"
}