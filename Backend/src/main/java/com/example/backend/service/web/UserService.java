package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.User;
import lombok.Data;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Transactional
@Data
public class UserService extends BaseDao{

    @Autowired
    private BaseDao baseDao;

    @Autowired
    private SessionFactory sessionFactory;

    public User create(User user) {
        return baseDao.save(user);
    }

    public User getById(UUID id) {
        return baseDao.getById(User.class, id);
    }

    public User getByUsername(String username) {
        return sessionFactory.getCurrentSession()
                .createQuery("from User where username = :u", User.class)
                .setParameter("u", username)
                .uniqueResult();
    }
}