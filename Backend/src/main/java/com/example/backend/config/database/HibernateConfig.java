package com.example.backend.config.database;

import org.hibernate.SessionFactory;
import org.hibernate.boot.MetadataSources;
import org.hibernate.boot.registry.StandardServiceRegistry;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HibernateConfig {

    @Bean
    public SessionFactory sessionFactory(){
        final StandardServiceRegistry registry = new StandardServiceRegistryBuilder()
                .configure()
                .build();
       // SessionFactory sessionFactoryobj;
        // MetadataSources sources = new MetadataSources(registry);
        // sources.addPackage("com.example.demo.repositry.dao");
        try {
            MetadataSources sources = new MetadataSources(registry);
        sources.addPackage("com.example.demo.repositry.dao");
            return  new MetadataSources(registry).buildMetadata().buildSessionFactory();
        }catch(Exception e ){
            StandardServiceRegistryBuilder.destroy(registry);
            throw new RuntimeException("Error in setting up Hibernate : "+e);
        }

    }

}
