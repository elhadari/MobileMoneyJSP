package com.example.demo.controller;

import com.example.demo.model.FraisRecep;
import com.example.demo.repository.FraisRecepRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/frais-recep")
@CrossOrigin(origins = "http://localhost:3000")
public class FraisRecepController {

    @Autowired
    private FraisRecepRepository repository;

    @GetMapping("/all")
    public List<FraisRecep> getAll() {
        return repository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Object> add(@RequestBody FraisRecep frais) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(frais));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("erreur", e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> update(@PathVariable String id, @RequestBody FraisRecep details) {
        return repository.findById(id)
                .map(frais -> {
                    frais.setMontant1(details.getMontant1());
                    frais.setMontant2(details.getMontant2());
                    frais.setFrais_rec(details.getFrais_rec());
                    return ResponseEntity.ok((Object) repository.save(frais));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erreur", "ID introuvable")));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable String id) {
        return repository.findById(id)
                .map(frais -> {
                    repository.delete(frais);
                    return ResponseEntity.ok((Object) Map.of("message", "Supprimé avec succès"));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erreur", "ID introuvable")));
    }
}