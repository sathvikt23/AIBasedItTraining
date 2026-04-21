package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.Dashboard;
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
@Data
public class DashboardService extends BaseDao {

    @Autowired
    private BaseDao baseDao;

    @Autowired
    private SessionFactory sessionFactory;

    public Dashboard create(UUID userId, Dashboard dashboard) {
        User user = baseDao.getById(User.class, userId);
        dashboard.setUser(user);
        return baseDao.save(dashboard);
    }

    public List<Dashboard> getByUser(UUID userId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from Dashboard where user.userId = :id", Dashboard.class)
                .setParameter("id", userId)
                .list();
    }


}