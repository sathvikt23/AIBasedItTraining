package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.Journey;
import com.example.backend.repositry.dao.Lesson;
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
public class LessonService extends BaseDao {

    @Autowired
    private BaseDao baseDao;

    @Autowired
    private SessionFactory sessionFactory;

    public Lesson create(UUID journeyId, Lesson lesson) {
        Journey journey = baseDao.getById(Journey.class, journeyId);
        lesson.setJourney(journey);
        return baseDao.save(lesson);
    }

    public List<Lesson> getByJourney(UUID journeyId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from Lesson where journey.journeyId = :id", Lesson.class)
                .setParameter("id", journeyId)
                .list();
    }

}