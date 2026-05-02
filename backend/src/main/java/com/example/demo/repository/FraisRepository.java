package com.example.demo.repository;

import com.example.demo.model.FraisEnvoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FraisRepository extends JpaRepository<FraisEnvoi, String> {
    //                                                   ^^^^^^ String fa tsy Integer/Long
}