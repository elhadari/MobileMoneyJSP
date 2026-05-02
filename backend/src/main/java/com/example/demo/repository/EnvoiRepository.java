package com.example.demo.repository;

import com.example.demo.model.Envoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnvoiRepository extends JpaRepository<Envoi, String> {
    
    List<Envoi> findByStatut(String statut);
    
    List<Envoi> findByNumEnvoyeur(String numEnvoyeur);
}