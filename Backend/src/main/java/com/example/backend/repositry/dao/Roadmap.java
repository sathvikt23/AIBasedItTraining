package com.example.backend.repositry.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "roadmaps")
@Data
public class Roadmap {

    @Id
    @GeneratedValue
    @Column(name = "roadmap_id")
    private UUID roadmapId;

    @ManyToOne
    @JoinColumn(name = "journey_id")
    private Journey journey;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> map;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> status;
}