package com.example.backend.repositry;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class BaseDao {

    @Autowired
    private SessionFactory sessionFactory;

    public <T> T save(T entity) {
        Session session = sessionFactory.getCurrentSession();
        session.persist(entity);
        return entity;
    }

    public <T> T getById(Class<T> clazz, UUID id) {
        return sessionFactory.getCurrentSession().get(clazz, id);
    }

    public <T> List<T> getAll(Class<T> clazz) {
        return sessionFactory.getCurrentSession()
                .createQuery("from " + clazz.getSimpleName(), clazz)
                .list();
    }

    public <T> void delete(Class<T> clazz, UUID id) {
        Session session = sessionFactory.getCurrentSession();
        T entity = session.get(clazz, id);
        if (entity != null) session.remove(entity);
    }
}