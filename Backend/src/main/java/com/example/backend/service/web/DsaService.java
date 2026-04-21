package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.Lesson;
import com.example.backend.repositry.dao.Dsa;
import lombok.Data;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
@Service
@Data
public class DsaService extends BaseDao {
    @Autowired
    private BaseDao baseDao;

    @Autowired
    private SessionFactory sessionFactory;

    public Dsa create(UUID lessonId, Dsa dsa) {
        Lesson lesson = baseDao.getById(Lesson.class, lessonId);
        dsa.setLesson(lesson);
        return baseDao.save(dsa);
    }

    public List<Dsa> getByLesson(UUID lessonId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from Dsa where lesson.lessonId = :id", Dsa.class)
                .setParameter("id", lessonId)
                .list();
    }
}
