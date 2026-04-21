package com.example.backend.repositry.dao;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;


@Entity
@Table(name = "lessons")
@Data
public class Lessonexp {

    @Id
    @GeneratedValue
    @Column(name = "lesson_id")
    private int lessonId;

    @ManyToOne
    @JoinColumn(name = "journey_id", nullable = false)
    private Journeyexp journey;

    private String sourceType;
    private String source;


    @Column(columnDefinition = "text")
    private String content;

    private String topicName;

    private Integer diffLevel;
    private Integer selfpaceLevel;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> sourceMetadata;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> topicMetadata;
}