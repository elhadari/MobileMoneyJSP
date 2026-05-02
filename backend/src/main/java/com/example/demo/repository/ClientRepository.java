package com.example.demo.repository;

import com.example.demo.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client, String> {
    // Ampio ity andalana ity mba ho haingana sy madio ny fikarohana amin'ny Email
    Optional<Client> findByMail(String mail);
}