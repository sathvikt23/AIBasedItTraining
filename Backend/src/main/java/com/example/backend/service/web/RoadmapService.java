package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.Journey;
import com.example.backend.repositry.dao.Roadmap;
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
public class RoadmapService extends BaseDao{

    @Autowired
    private BaseDao baseDao;

    @Autowired
    private SessionFactory sessionFactory;


    public Roadmap create(Roadmap roadmap) {
        return baseDao.save(roadmap);
    }

    // ✅ STEP 2: Assign roadmap to journey
    public Roadmap assignToJourney(UUID roadmapId, UUID journeyId) {
        Roadmap roadmap = baseDao.getById(Roadmap.class, roadmapId);
        Journey journey = baseDao.getById(Journey.class, journeyId);

        roadmap.setJourney(journey);
        return baseDao.save(roadmap); // update
    }

    // ✅ Fetch by journey
    public List<Roadmap> getByJourney(UUID journeyId) {
        return sessionFactory.getCurrentSession()
                .createQuery("from Roadmap where journey.journeyId = :id", Roadmap.class)
                .setParameter("id", journeyId)
                .list();
    }

    // ✅ Optional: get by id
    public Roadmap getById(UUID id) {
        return baseDao.getById(Roadmap.class, id);
    }
}