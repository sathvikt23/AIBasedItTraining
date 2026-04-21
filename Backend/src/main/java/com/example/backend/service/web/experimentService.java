package com.example.backend.service.web;

import com.example.backend.repositry.BaseDao;
import com.example.backend.repositry.dao.Journeyexp;
import com.example.backend.repositry.dao.Lessonexp;
import com.example.backend.repositry.dao.Roadmapexp;
import com.example.backend.repositry.dao.Userexp;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class experimentService extends BaseDao {

    @Autowired
    private SessionFactory sessionFactory;

    /**
     * Create roadmap, journey and lessons (for topic & subtopic)
     * @param roadmapResponse the roadmap JSON from frontend
     * @return Map containing roadmapId and journeyId
     */
    public Map<String, Integer> createAll(Map<String, Object> roadmapResponse) {

        // -------------------------------
        // 🔹 Hardcoded IDs
        // -------------------------------
        int roadmapId = 100;
        int journeyId = 200;
        int userId = 1;

        Transaction tx = null;

        try (Session session = sessionFactory.openSession()) {
            tx = session.beginTransaction();

            // -------------------------------
            // 🔹 STEP 0: Load user
            // -------------------------------
            Userexp user = session.get(Userexp.class, userId);
            if (user == null) {
                throw new RuntimeException("User not found with id: " + userId);
            }

            // -------------------------------
            // 🔹 STEP 1: Create Journey
            // -------------------------------
            Journeyexp journey = new Journeyexp();
            journey.setJourneyId(journeyId);
            journey.setUser(user);
            journey.setJourneyName((String) roadmapResponse.get("title"));
            journey.setRoadmapId(roadmapId);
            journey.setJourneyMetadata(Map.of("createdFrom", "AI"));

            session.save(journey);

            // -------------------------------
            // 🔹 STEP 2: Create Roadmap
            // -------------------------------
            Roadmapexp roadmap = new Roadmapexp();
            roadmap.setRoadmapId(roadmapId);
            roadmap.setJourney(journey);
            roadmap.setMap(roadmapResponse);
            roadmap.setStatus(Map.of("status", "created"));

            session.save(roadmap);

            // -------------------------------
            // 🔹 STEP 3: Create Lessons for topic & subtopic
            // -------------------------------
            List<Map<String, Object>> nodes = (List<Map<String, Object>>) roadmapResponse.get("nodes");
            if (nodes != null) {
                for (Map<String, Object> node : nodes) {
                    String type = (String) node.get("type");

                    if ("topic".equals(type) || "subtopic".equals(type)) {
                        Lessonexp lesson = new Lessonexp();

                        lesson.setJourney(journey);
                        lesson.setTopicName((String) node.get("label"));
                        lesson.setSourceType("roadmap");
                        lesson.setSource("AI");
                        lesson.setContent("Auto-generated lesson for " + node.get("label"));
                        lesson.setDiffLevel(1);
                        lesson.setSelfpaceLevel(1);
                        lesson.setSourceMetadata(Map.of(
                                "nodeId", node.get("id"),
                                "type", type
                        ));
                        lesson.setTopicMetadata(node);

                        session.save(lesson);
                    }
                }
            }

            tx.commit();

        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw new RuntimeException("Error creating roadmap/journey/lessons", e);
        }

        // -------------------------------
        // 🔹 STEP 4: Return IDs
        // -------------------------------
        return Map.of(
                "roadmapId", roadmapId,
                "journeyId", journeyId
        );
    }

    public List<Integer> getJourneyIdsByUserId(int userId) {
        try (Session session = sessionFactory.openSession()) {
            String hql = "SELECT j.journeyId FROM Journeyexp j WHERE j.user.userId = :uid";
            Query<Integer> query = session.createQuery(hql, Integer.class);
            query.setParameter("uid", userId);
            return query.list();
        }
    }

    public List<Integer> getLessonIdsByJourneyId(int journeyId) {
        try (Session session = sessionFactory.openSession()) {
            String hql = "SELECT l.lessonId FROM Lessonexp l WHERE l.journey.journeyId = :jid";
            Query<Integer> query = session.createQuery(hql, Integer.class);
            query.setParameter("jid", journeyId);
            return query.list();
        }
    }

    public Map<String, Object> getRoadmapMapById(int roadmapId) {
        try (Session session = sessionFactory.openSession()) {
            Roadmapexp roadmap = session.get(Roadmapexp.class, roadmapId);
            if (roadmap != null) {
                return roadmap.getMap();
            }
            return null; // or throw exception
        }
    }

    public void updateRoadmapMap(int roadmapId, Map<String, Object> newMap) {
        Transaction tx = null;
        try (Session session = sessionFactory.openSession()) {
            tx = session.beginTransaction();

            Roadmapexp roadmap = session.get(Roadmapexp.class, roadmapId);
            if (roadmap == null) {
                throw new RuntimeException("Roadmap not found with id: " + roadmapId);
            }

            roadmap.setMap(newMap);
            session.update(roadmap);

            tx.commit();
        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw new RuntimeException("Error updating roadmap", e);
        }
    }
    public Map<String, Object> getLessonDetailsById(int lessonId) {
        try (Session session = sessionFactory.openSession()) {
            Lessonexp lesson = session.get(Lessonexp.class, lessonId);
            if (lesson == null) {
                throw new RuntimeException("Lesson not found with id: " + lessonId);
            }

            return Map.of(
                    "topic", lesson.getTopicName(),
                    "video_id", lesson.getSource(),     // maps source -> video_id
                    "past_quiz", false,
                    "past_codes", false
            );
        }
    }
}