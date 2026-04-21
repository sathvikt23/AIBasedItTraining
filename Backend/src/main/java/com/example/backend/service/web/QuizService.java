package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.Lesson;
import com.example.backend.repositry.dao.Quiz;
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
public class QuizService extends BaseDao{

    @Autowired
    private BaseDao baseDao;

    @Autowired
    private SessionFactory sessionFactory;

    public Quiz create(UUID lessonId, Quiz quiz) {
        Lesson lesson = baseDao.getById(Lesson.class, lessonId);
        quiz.setLesson(lesson);
        return baseDao.save(quiz);
    }

    public List<Quiz> getByLesson(UUID lessonId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from Quiz where lesson.lessonId = :id", Quiz.class)
                .setParameter("id", lessonId)
                .list();
    }
}