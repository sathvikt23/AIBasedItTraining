package com.example.backend.repositry.dao;

import com.example.backend.repositry.BaseDao;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "dsa")
@Data
public class Dsa extends BaseDao {

    @Id
    @GeneratedValue
    @Column(name = "dsa_id")
    private UUID dsaId;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> questions;
}