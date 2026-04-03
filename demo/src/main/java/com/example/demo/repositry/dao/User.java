package com.example.demo.repositry.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.type.SqlTypes;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue
    @Column(name = "user_id")
    private UUID userId;

    @Column(nullable = false, unique = true)
    private String username;
}