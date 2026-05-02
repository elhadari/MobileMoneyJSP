package com.example.demo.dto;

import lombok.Data;

@Data
public class TransferRequest {
    private String from;     
    private String to;       
    private Double amount;    
    private String raison;   
    
    // Constructeur par défaut
    public TransferRequest() {}

    // Constructeur avec paramètres
    public TransferRequest(String from, String to, Double amount, String raison) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.raison = raison;
    }
}