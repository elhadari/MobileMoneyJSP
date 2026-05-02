package com.example.demo.repository;

import com.example.demo.model.FraisRecep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FraisRecepRepository extends JpaRepository<FraisRecep, String> {
}