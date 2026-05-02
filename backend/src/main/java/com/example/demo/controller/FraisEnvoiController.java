package com.example.demo.controller;

import com.example.demo.model.FraisEnvoi;
import com.example.demo.repository.FraisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/frais")
@CrossOrigin(origins = "http://localhost:3000")
public class FraisEnvoiController {

    @Autowired
    private FraisRepository fraisRepository;

    @GetMapping("/all")
    public List<FraisEnvoi> obtenirTousLesFrais() {
        return fraisRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Object> ajouterFrais(@RequestBody FraisEnvoi frais) {
        try {
            if (frais.getMontant1() == null || frais.getMontant2() == null) {
                return ResponseEntity.badRequest().body(Map.of("erreur", "Champs obligatoires manquants"));
            }
            return ResponseEntity.status(HttpStatus.CREATED).body(fraisRepository.save(frais));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("erreur", e.getMessage()));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object> mettreAJourFrais(@PathVariable String id, @RequestBody FraisEnvoi details) {
        //                                             ^^^^^^ ITO NO OVANA HO STRING
        return fraisRepository.findById(id)
                .map(frais -> {
                    frais.setMontant1(details.getMontant1());
                    frais.setMontant2(details.getMontant2());
                    frais.setFrais_env(details.getFrais_env());
                    return ResponseEntity.ok((Object) fraisRepository.save(frais));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erreur", "Aucune ID")));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> supprimerFrais(@PathVariable String id) {
        //                                             ^^^^^^ ITO KOA OVANA HO STRING
        return fraisRepository.findById(id)
                .map(frais -> {
                    fraisRepository.delete(frais);
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Supprimé avec succès");
                    return ResponseEntity.ok((Object) response);
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("erreur", "Aucune ID")));
    }
}