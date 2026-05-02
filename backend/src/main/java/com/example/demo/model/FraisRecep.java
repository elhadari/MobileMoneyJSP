package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "frais_recep")
@Data
public class FraisRecep {
    
    @Id
    private String idrec; 
    private Integer montant1;
    private Integer montant2;
    private Integer frais_rec;

    @PrePersist
    public void ensureId() {
        if (this.idrec == null || this.idrec.isEmpty()) {
            
            this.idrec = UUID.randomUUID().toString().substring(0, 8);
        }
    }
}