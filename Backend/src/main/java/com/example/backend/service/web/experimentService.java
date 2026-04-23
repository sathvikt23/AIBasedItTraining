package com.example.backend.service.web;

import com.example.backend.repositry.dao.Journeyexp;
import com.example.backend.repositry.dao.Lessonexp;
import com.example.backend.repositry.dao.Roadmapexp;
import com.example.backend.repositry.dao.Userexp;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class experimentService {

    @Autowired
    private SessionFactory sessionFactory;

    public Map<String, Integer> createAll(Map<String, Object> roadmapResponse) {

        Session session = null;
        Transaction tx = null;

        try {
            // -------------------------------
            // 🔹 STEP 1: Extract data safely
            // -------------------------------
            Map<String, Object> map = (Map<String, Object>) roadmapResponse.get("map");
            if (map == null) {
                throw new RuntimeException("Invalid input: 'map' missing");
            }

            List<Map<String, Object>> nodes =
                    (List<Map<String, Object>>) map.get("nodes");

            if (nodes == null || nodes.isEmpty()) {
                throw new RuntimeException("Invalid input: 'nodes' missing or empty");
            }

            String journeyName = (String) nodes.get(0).get("label");
            if (journeyName == null) {
                throw new RuntimeException("Invalid input: first node label missing");
            }

            int userId = 1; // TODO: replace with actual logged-in user

            // -------------------------------
            // 🔹 STEP 2: Open session
            // -------------------------------
            session = sessionFactory.openSession();
            tx = session.beginTransaction();

            // -------------------------------
            // 🔹 STEP 3: Load User
            // -------------------------------
            Userexp user = session.get(Userexp.class, userId);
            if (user == null) {
                throw new RuntimeException("User not found with id: " + userId);
            }

            // -------------------------------
            // 🔹 STEP 4: Create Journey
            // -------------------------------
            Journeyexp journey = new Journeyexp();
            journey.setUser(user);
            journey.setJourneyName("JPWVWPINIPWONV");
            journey.setJourneyMetadata(Map.of("createdFrom", "AI"));

            session.save(journey); // ID auto-generated

            // -------------------------------
            // 🔹 STEP 5: Create Roadmap
            // -------------------------------
            Roadmapexp roadmap = new Roadmapexp();
            roadmap.setJourney(journey);
            roadmap.setMap(roadmapResponse);
            roadmap.setStatus(Map.of("status", "created"));

            session.save(roadmap);

            // -------------------------------
            // 🔹 STEP 6: Create Lessons
            // -------------------------------
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

            // -------------------------------
            // 🔹 STEP 7: Commit
            // -------------------------------
            tx.commit();

            // -------------------------------
            // 🔹 STEP 8: Return IDs
            // -------------------------------
            return Map.of(
                    "roadmapId", roadmap.getRoadmapId(),
                    "journeyId", journey.getJourneyId()
            );

        } catch (Exception e) {
            if (tx != null) tx.rollback();
            throw new RuntimeException("Error creating roadmap/journey/lessons", e);

        } finally {
            if (session != null) session.close();
        }
    }
}