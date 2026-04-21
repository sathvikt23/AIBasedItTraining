package com.example.backend.repositry.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "journeysexp")
@Data
public class Journeyexp {

    @Id
    @GeneratedValue
    @Column(name = "journey_id")
    private int journeyId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private  Userexp user;

    private String journeyName;

    @Column(name = "roadmap_id")
    private int roadmapId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> journeyMetadata;
}