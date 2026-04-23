package com.example.backend.config.database;

import com.example.backend.repositry.dao.*;
import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HibernateConfig {

    @Bean
    public SessionFactory sessionFactory() {

        final StandardServiceRegistry registry =
                new StandardServiceRegistryBuilder()
                        .configure() // reads hibernate.cfg.xml
                        .build();

        try {
            MetadataSources sources = new MetadataSources(registry);

            // ✅ REGISTER ENTITIES EXPLICITLY
            sources.addAnnotatedClass(Userexp.class);
            sources.addAnnotatedClass(Journeyexp.class);
            sources.addAnnotatedClass(Roadmapexp.class);
            sources.addAnnotatedClass(Lessonexp.class);

            return sources.buildMetadata().buildSessionFactory();

        } catch (Exception e) {
            StandardServiceRegistryBuilder.destroy(registry);
            throw new RuntimeException("Error in setting up Hibernate", e);
        }
    }
}