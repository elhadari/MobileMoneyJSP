package com.example.demo.dto;

import lombok.Data;

@Data
public class DepositRequest {
    private String numtel;    // Le numéro du compte à créditer
    private Double amount;    // Le montant à déposer

    // Constructeur par défaut
    public DepositRequest() {}

    // Constructeur avec paramètres
    public DepositRequest(String numtel, Double amount) {
        this.numtel = numtel;
        this.amount = amount;
    }
}