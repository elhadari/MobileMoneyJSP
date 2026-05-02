package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "frais_envoi")
@Data
public class FraisEnvoi {
    
    @Id
    private String idenv; 

    private Double montant1;
    private Double montant2;
    private Double frais_env;

    // Ity no "Magic" mampandeha ny Ajout ho azy
    @PrePersist
    public void ensureId() {
        if (this.idenv == null || this.idenv.isEmpty()) {
            // Mamorona ID fohy (8 characters) mba hifanaraka amin'ny varchar(10) ao amin'ny DB-nao
            this.idenv = UUID.randomUUID().toString().substring(0, 8);
        }
    }
}