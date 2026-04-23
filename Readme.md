CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid() ,
    username TEXT NOT NULL UNIQUE
);

CREATE TABLE dashboards (
    dashboard_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
    user_id UUID NOT NULL,
    dashboard_metadata JSONB,

    CONSTRAINT fk_dashboard_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


CREATE TABLE journeys (
    journey_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
    user_id UUID NOT NULL,
    journey_name TEXT NOT NULL,
    roadmap_id UUID,
    journey_metadata JSONB,

    CONSTRAINT fk_journey_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

CREATE TABLE roadmaps (
    roadmap_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
    journey_id UUID,
    map JSONB,
    status JSONB,

    CONSTRAINT fk_roadmap_journey
        FOREIGN KEY (journey_id)
        REFERENCES journeys(journey_id)
        ON DELETE CASCADE
);


CREATE TABLE lessons (
    lesson_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
    journey_id UUID NOT NULL,

    source_type TEXT,
    source TEXT,
    source_metadata JSONB,

    content TEXT,
    topic_name TEXT,

    diff_level INT,
    selfpace_level INT,

    topic_metadata JSONB,

    CONSTRAINT fk_lesson_journey
        FOREIGN KEY (journey_id)
        REFERENCES journeys(journey_id)
        ON DELETE CASCADE
);

CREATE TABLE dsa (
    dsa_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
    lesson_id UUID NOT NULL,
    questions JSONB,

    CONSTRAINT fk_dsa_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(lesson_id)
        ON DELETE CASCADE
);


CREATE TABLE quizzes (
    quiz_id UUID PRIMARY KEY DEFAULT  gen_random_uuid(),
    lesson_id UUID NOT NULL,
    questions JSONB,

    CONSTRAINT fk_quiz_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(lesson_id)
        ON DELETE CASCADE
);


CREATE TABLE interviews (
    interview_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID,
    interview_metadata JSONB,
    topic_id UUID,
    summary TEXT,

    CONSTRAINT fk_interview_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(lesson_id)
        ON DELETE SET NULL
);

CREATE INDEX idx_dashboard_user ON dashboards(user_id);
CREATE INDEX idx_journey_user ON journeys(user_id);
CREATE INDEX idx_roadmap_journey ON roadmaps(journey_id);
CREATE INDEX idx_lesson_journey ON lessons(journey_id);
CREATE INDEX idx_dsa_lesson ON dsa(lesson_id);
CREATE INDEX idx_quiz_lesson ON quizzes(lesson_id);
CREATE INDEX idx_interview_lesson ON interviews(lesson_id);