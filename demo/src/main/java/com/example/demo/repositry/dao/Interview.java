package com.example.demo.repositry.dao;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "interviews")
@Data
public class Interview {

    @Id
    @GeneratedValue
    @Column(name = "interview_id")
    private UUID interviewId;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> interviewMetadata;

    private UUID topicId;

    private String summary;
}