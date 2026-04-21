package com.example.backend.repositry.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "roadmapsexp")
@Data
public class Roadmapexp {

    @Id
    @GeneratedValue
    @Column(name = "roadmap_id")
    private int roadmapId;

    @ManyToOne
    @JoinColumn(name = "journey_id")
    private Journeyexp journey;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> map;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> status;
}