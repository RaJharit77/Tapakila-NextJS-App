-- =====================================================
-- Seed SQL pour la console NeonDB (SQL Editor)
-- Mot de passe de tous les comptes : Password123!
-- =====================================================

-- Extension pour hasher les mots de passe (bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- ---------- Nettoyage (ordre des FK) ----------
DELETE FROM "Message";
DELETE FROM "Ticket";
DELETE FROM "Event";
DELETE FROM "User";
DELETE FROM "Admin";

-- ---------- ADMINS ----------
INSERT INTO "Admin" (admin_id, admin_name, admin_mail, admin_password) VALUES
  ('adm_001', 'Alice Admin', 'alice@events.com', crypt('Password123!', gen_salt('bf', 10))),
  ('adm_002', 'Bob Manager', 'bob@events.com',   crypt('Password123!', gen_salt('bf', 10)));

-- ---------- USERS ----------
INSERT INTO "User" (user_id, user_name, user_email, user_password, user_first_login_date, user_address, user_city) VALUES
  ('usr_001', 'Claire Martin', 'claire@mail.com', crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '80 days', '12 rue de Rivoli',        'Paris'),
  ('usr_002', 'David Dupont',  'david@mail.com',  crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '60 days', '5 place Bellecour',        'Lyon'),
  ('usr_003', 'Emma Leroy',    'emma@mail.com',   crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '40 days', NULL,                       'Marseille'),
  ('usr_004', 'Farid Benali',  'farid@mail.com',  crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '20 days', NULL,                       NULL),
  ('usr_005', 'Giulia Rossi',  'giulia@mail.com', crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '5 days',  '8 promenade des Anglais', 'Nice');
-- user_image prend sa valeur par défaut (icône Flaticon)

-- ---------- EVENTS ----------
INSERT INTO "Event" (
  event_id, event_name, event_date, event_place, event_description, event_image,
  admin_id, event_organizer, event_status, event_category, event_tickets_limit_by_user_by_type
) VALUES
  ('evt_001', 'Festival Électro Summer',     NOW() + INTERVAL '30 days', 'Parc des Expositions',
   'Deux jours de musique électronique avec les meilleurs DJs.',
   'https://picsum.photos/seed/electro/800/400',
   'adm_001', 'Summer Productions', 'UPLOADED', 'Musique', 5),

  ('evt_002', 'Conférence Tech & IA 2026',   NOW() + INTERVAL '45 days', 'Palais des Congrès',
   'Conférences et ateliers sur l''intelligence artificielle.',
   'https://picsum.photos/seed/tech/800/400',
   'adm_002', 'TechWorld', 'UPLOADED', 'Conférence', 3),

  ('evt_003', 'Soirée Stand-up Comedy',      NOW() + INTERVAL '10 days', 'Théâtre Municipal',
   'Cinq humoristes sur scène pour une soirée de rire.',
   'https://picsum.photos/seed/comedy/800/400',
   'adm_001', 'Rire Ensemble', 'UPLOADED', 'Humour', 4),

  ('evt_004', 'Tournoi E-sport Arena',       NOW() + INTERVAL '60 days', 'Arena Gaming Center',
   NULL, NULL,
   'adm_002', 'Arena Gaming', 'DRAFT', 'Gaming', 5),

  ('evt_005', 'Gala de Charité (annulé)',    NOW() - INTERVAL '5 days',  'Hôtel Grand Palace',
   'Soirée de gala au profit d''associations locales.',
   'https://picsum.photos/seed/gala/800/400',
   'adm_001', 'Fondation Solidaire', 'CANCLED', 'Charité', 2);

-- ---------- TICKETS ----------
-- 12 tickets par event : 2 VIP, 3 EARLY_BIRD, 7 STANDARD
-- n = 1,3,6,8 -> SOLD | n = 7 -> RESERVED | autres -> AVAILABLE
INSERT INTO "Ticket" (ticket_id, ticket_type, ticket_price, ticket_status, user_id, event_id)
SELECT
  e.event_id || '-T' || LPAD(n::text, 2, '0'),
  (CASE WHEN n <= 2 THEN 'VIP' WHEN n <= 5 THEN 'EARLY_BIRD' ELSE 'STANDARD' END)::"Type",
  CASE WHEN n <= 2 THEN 150 WHEN n <= 5 THEN 40 ELSE 60 END,
  (CASE WHEN n IN (1, 3, 6, 8) THEN 'SOLD'
        WHEN n = 7             THEN 'RESERVED'
        ELSE 'AVAILABLE' END)::"Status",
  CASE WHEN n IN (1, 3, 6, 7, 8)
       THEN (ARRAY['usr_001','usr_002','usr_003','usr_004','usr_005'])[1 + (n % 5)]
       ELSE NULL END,
  e.event_id
FROM "Event" e
CROSS JOIN generate_series(1, 12) AS n;

-- ---------- MESSAGES ----------
INSERT INTO "Message" (message_id, message_subject, message_content, message_date, user_id) VALUES
  ('msg_001', 'Problème de paiement',
   'Bonjour, mon paiement a été débité mais je n''ai pas reçu mon billet.',
   NOW() - INTERVAL '3 days', 'usr_001'),
  ('msg_002', 'Remboursement',
   'Pouvez-vous me rembourser mon billet pour le gala annulé ?',
   NOW() - INTERVAL '2 days', 'usr_002'),
  ('msg_003', 'Question sur les billets VIP',
   'Que comprend exactement l''offre VIP du festival ?',
   NOW() - INTERVAL '1 day', 'usr_003'),
  ('msg_004', NULL,
   'Merci pour l''organisation, super expérience !',
   NOW(), 'usr_005');

COMMIT;

-- ---------- Vérification ----------
SELECT 'Admin' AS "table", COUNT(*) FROM "Admin"
UNION ALL SELECT 'User',    COUNT(*) FROM "User"
UNION ALL SELECT 'Event',   COUNT(*) FROM "Event"
UNION ALL SELECT 'Ticket',  COUNT(*) FROM "Ticket"
UNION ALL SELECT 'Message', COUNT(*) FROM "Message";
