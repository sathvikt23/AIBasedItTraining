package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.Journey;
import com.example.backend.repositry.dao.User;
import lombok.Data;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Data public class JourneyService extends BaseDao {

    @Autowired
    private BaseDao baseDao;

    @Autowired
    private SessionFactory sessionFactory;

    public Journey create(UUID userId, Journey journey) {
        User user = baseDao.getById(User.class, userId);
        journey.setUser(user);
        return baseDao.save(journey);
    }

    public List<Journey> getByUser(UUID userId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from Journey where user.userId = :id", Journey.class)
                .setParameter("id", userId)
                .list();
    }
}