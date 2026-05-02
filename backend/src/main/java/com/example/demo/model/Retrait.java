package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "retrait")
public class Retrait {

    @Id
    @Column(name = "idrecep", length = 10)
    private String idrecep; 

    @Column(name = "numtel", length = 15)
    private String numtel;   

    @Column(name = "montant")
    private Integer montant;

    @Column(name = "daterecep")
    private LocalDate daterecep; 

    @Column(name = "statut", length = 20)
    private String statut = "PENDING"; // "PENDING", "COMPLETED", "REJECTED"
}