package com.example.backend.repositry.dao;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "usersexp")
@Data
public class Userexp {

    @Id
    @GeneratedValue
    @Column(name = "user_id")
    private int userId;

    @Column(nullable = false, unique = true)
    private String username;
}