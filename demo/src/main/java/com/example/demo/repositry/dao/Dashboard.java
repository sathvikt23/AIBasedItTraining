package com.example.demo.repositry.dao;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "dashboards")
@Data
public class Dashboard {

    @Id
    @GeneratedValue
    @Column(name = "dashboard_id")
    private UUID dashboardId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> dashboardMetadata;
}