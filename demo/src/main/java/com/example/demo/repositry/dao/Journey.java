package com.example.demo.repositry.dao;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "journeys")
@Data
public class Journey {

    @Id
    @GeneratedValue
    @Column(name = "journey_id")
    private UUID journeyId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String journeyName;

    @Column(name = "roadmap_id")
    private UUID roadmapId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> journeyMetadata;
}