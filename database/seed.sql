-- Akshara High School: sample data for DEVELOPMENT only.
-- Do not load this on the live school website.
--
-- Run after schema.sql:
--   psql -U akshara_app -h localhost -d akshara_school -v ON_ERROR_STOP=1 -f database/seed.sql

BEGIN;

INSERT INTO events (title, description, event_date, location) VALUES
    ('Annual Day',
     'A showcase of student talent through music, dance and drama.',
     NULL, 'School campus'),
    ('Sports Day',
     'Races, team games and fun activities for students of all classes.',
     NULL, 'School grounds'),
    ('Science Exhibition',
     'Students present working models and projects to parents and teachers.',
     NULL, 'School campus'),
    ('Children''s Day Celebration',
     'A day of fun, performances and surprises for our students.',
     NULL, 'School campus'),
    ('Parent-Teacher Meeting',
     'A chance for parents to talk with teachers about their child''s progress.',
     NULL, 'Classrooms'),
    ('Art and Craft Fair',
     'An exhibition of student artwork and handmade crafts.',
     NULL, 'School campus');

INSERT INTO gallery_items (title, description, category, image_url) VALUES
    ('Bright Classrooms', 'A sample photo of a bright, welcoming classroom.', 'Classrooms', NULL),
    ('Group Learning', 'A sample photo of students learning together.', 'Classrooms', NULL),
    ('Art Time', 'A sample photo of students enjoying an art activity.', 'Activities', NULL),
    ('Music Practice', 'A sample photo of a music practice session.', 'Activities', NULL),
    ('Play Time', 'A sample photo of children playing outdoors.', 'Sports', NULL),
    ('Team Games', 'A sample photo of a team game in progress.', 'Sports', NULL),
    ('Annual Programme', 'A sample photo from a school programme.', 'Events', NULL),
    ('Science Exhibition', 'A sample photo of students presenting their projects.', 'Events', NULL),
    ('Festival Day', 'A sample photo of a festival celebration at school.', 'Celebrations', NULL),
    ('Children''s Day', 'A sample photo of a special day celebrated together.', 'Celebrations', NULL),
    ('School Grounds', 'A sample photo of the school grounds.', 'Campus', NULL),
    ('Assembly Area', 'A sample photo of the morning assembly area.', 'Campus', NULL);

COMMIT;