package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "client")
public class Client {
    
    @Id
    @Column(name = "numtel", length = 15)
    private String numtel; 

    @Column(name = "nom", length = 100)
    private String nom;

    @Column(name = "sexe", length = 10)
    private String sexe;

    @Column(name = "age")
    private Integer age;

    @Column(name = "mail", length = 100)
    private String mail;

    @Column(name = "solde")
    private Double solde; // Novaina ho Double mba hifanaraka amin'ny Transaction

    public Client() {}

    public Client(String numtel, String nom, String sexe, Integer age, String mail, Double solde) {
        this.numtel = numtel;
        this.nom = nom;
        this.sexe = sexe;
        this.age = age;
        this.mail = mail;
        this.solde = solde;
    }

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

    public Double getSolde() { return solde; }
    public void setSolde(Double solde) { this.solde = solde; }
}