package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
public class Client {
    
    @Id
    private String numtel; 

    private String nom;
    private String sexe;
    private Integer age;
    private String mail;
    private Integer solde;

    public Client() {}

    // --- Getters et Setters ---
    public String getNumtel() { return numtel; }
    public void setNumtel(String numtel) { this.numtel = numtel; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getSexe() { return sexe; }
    public void setSexe(String sexe) { this.sexe = sexe; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }

    public Integer getSolde() { return solde; }
    public void setSolde(Integer solde) { this.solde = solde; }
}