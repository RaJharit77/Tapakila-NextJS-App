-- =====================================================
-- Seed SQL pour la console NeonDB (SQL Editor)
-- PRÉREQUIS : la colonne admin_role doit exister (voir migration-admin-role.sql)
-- Super admin : superadmin@events.com / SuperAdmin123!  (à changer en prod)
-- Autres comptes : Password123!
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

DELETE FROM "Message";
DELETE FROM "Ticket";
DELETE FROM "Event";
DELETE FROM "User";
DELETE FROM "Admin";

-- ---------- ADMINS ----------
INSERT INTO "Admin" (admin_id, admin_name, admin_mail, admin_password, admin_role) VALUES
  ('ADM0001', 'Super Admin',  'superadmin@events.com', crypt('SuperAdmin123!', gen_salt('bf', 12)), 'SUPER_ADMIN'),
  ('ADM0002', 'Alice Admin',  'alice@events.com',      crypt('Password123!',   gen_salt('bf', 10)), 'ADMIN'),
  ('ADM0003', 'Bob Manager',  'bob@events.com',        crypt('Password123!',   gen_salt('bf', 10)), 'ADMIN');

-- ---------- USERS ----------
INSERT INTO "User" (user_id, user_name, user_email, user_password, user_first_login_date, user_address, user_city) VALUES
  ('USR0001', 'Claire Martin', 'claire@mail.com', crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '80 days', '12 rue de Rivoli',        'Paris'),
  ('USR0002', 'David Dupont',  'david@mail.com',  crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '60 days', '5 place Bellecour',        'Lyon'),
  ('USR0003', 'Emma Leroy',    'emma@mail.com',   crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '45 days', NULL,                       'Marseille'),
  ('USR0004', 'Farid Benali',  'farid@mail.com',  crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '30 days', NULL,                       NULL),
  ('USR0005', 'Giulia Rossi',  'giulia@mail.com', crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '21 days', '8 promenade des Anglais', 'Nice'),
  ('USR0006', 'Hugo Bernard',  'hugo@mail.com',   crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '14 days', NULL,                       'Toulouse'),
  ('USR0007', 'Inès Moreau',   'ines@mail.com',   crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '7 days',  '3 quai de la Fosse',       'Nantes'),
  ('USR0008', 'Jules Petit',   'jules@mail.com',  crypt('Password123!', gen_salt('bf', 10)), NOW() - INTERVAL '2 days',  NULL,                       'Lille');

-- ---------- EVENTS (dates relatives à aujourd'hui) ----------
INSERT INTO "Event" (event_id, event_name, event_date, event_place, event_description, event_image,
                     admin_id, event_organizer, event_status, event_category, event_tickets_limit_by_user_by_type) VALUES
  ('E00001', 'Festival Électro Summer',
   date_trunc('day', NOW()) + INTERVAL '30 days 18 hours', 'Parc des Expositions',
   'Deux jours de musique électronique avec les meilleurs DJs internationaux et trois scènes.',
   'https://picsum.photos/seed/electro/800/400', 'ADM0002', 'Summer Productions', 'UPLOADED', 'Musique', 5),

  ('E00002', 'Conférence Tech & IA 2026',
   date_trunc('day', NOW()) + INTERVAL '45 days 9 hours', 'Palais des Congrès',
   'Conférences, démos et ateliers sur l''intelligence artificielle et le cloud.',
   'https://picsum.photos/seed/tech/800/400', 'ADM0003', 'TechWorld', 'UPLOADED', 'Conférence', 3),

  ('E00003', 'Soirée Stand-up Comedy',
   date_trunc('day', NOW()) + INTERVAL '10 days 20 hours', 'Théâtre Municipal',
   'Cinq humoristes sur scène pour une soirée de rire garantie.',
   'https://picsum.photos/seed/comedy/800/400', 'ADM0002', 'Rire Ensemble', 'UPLOADED', 'Humour', 4),

  ('E00004', 'Tournoi E-sport Arena',
   date_trunc('day', NOW()) + INTERVAL '60 days 14 hours', 'Arena Gaming Center',
   NULL, NULL, 'ADM0003', 'Arena Gaming', 'DRAFT', 'Gaming', 5),

  ('E00005', 'Marathon de la Ville',
   date_trunc('day', NOW()) + INTERVAL '75 days 7 hours', 'Place de l''Hôtel de Ville',
   'Marathon, semi-marathon et 10 km ouverts à tous les niveaux.',
   'https://picsum.photos/seed/marathon/800/400', 'ADM0002', 'Club Athlétisme Métropole', 'UPLOADED', 'Sport', 5),

  ('E00006', 'Salon de la Gastronomie',
   date_trunc('day', NOW()) + INTERVAL '20 days 10 hours', 'Halle des Saveurs',
   'Dégustations, démonstrations de chefs et marché de producteurs locaux.',
   'https://picsum.photos/seed/food/800/400', 'ADM0003', 'Gourmet Events', 'UPLOADED', 'Gastronomie', 6),

  ('E00007', 'Exposition d''Art Contemporain',
   date_trunc('day', NOW()) + INTERVAL '38 days 11 hours', 'Musée des Arts Modernes',
   'Une centaine d''œuvres d''artistes émergents, avec visites guidées.',
   'https://picsum.photos/seed/art/800/400', 'ADM0002', 'Galerie Horizon', 'UPLOADED', 'Art', 8),

  ('E00008', 'Nuit du Cinéma en plein air',
   date_trunc('day', NOW()) + INTERVAL '14 days 21 hours', 'Esplanade du Lac',
   'Trois films cultes projetés sur écran géant, plaids et pop-corn inclus.',
   'https://picsum.photos/seed/cinema/800/400', 'ADM0003', 'Ciné Nomade', 'UPLOADED', 'Cinéma', 6),

  ('E00009', 'Théâtre : Le Dernier Acte',
   date_trunc('day', NOW()) + INTERVAL '25 days 20 hours', 'Théâtre des Variétés',
   'Une comédie dramatique en trois actes portée par une troupe de dix comédiens.',
   'https://picsum.photos/seed/theatre/800/400', 'ADM0002', 'Compagnie Les Planches', 'UPLOADED', 'Théâtre', 4),

  ('E00010', 'Business Summit Startups',
   date_trunc('day', NOW()) + INTERVAL '90 days 9 hours', 'Centre d''Affaires International',
   'Pitchs, networking et tables rondes avec fondateurs et investisseurs.',
   'https://picsum.photos/seed/business/800/400', 'ADM0001', 'Startup Hub', 'UPLOADED', 'Business', 3),

  ('E00011', 'Concert de l''Orchestre Symphonique',
   date_trunc('day', NOW()) + INTERVAL '52 days 19 hours', 'Auditorium Central',
   'Programme dédié aux grandes symphonies romantiques.',
   'https://picsum.photos/seed/orchestra/800/400', 'ADM0003', 'Orchestre Symphonique Régional', 'UPLOADED', 'Musique', 5),

  ('E00012', 'Gala de Charité (annulé)',
   date_trunc('day', NOW()) - INTERVAL '5 days' + INTERVAL '19 hours', 'Hôtel Grand Palace',
   'Soirée de gala au profit d''associations locales.',
   'https://picsum.photos/seed/gala/800/400', 'ADM0002', 'Fondation Solidaire', 'CANCLED', 'Charité', 2);

-- ---------- TICKETS ----------
-- IDs : E00001TKT1, E00001TKT2, ... (format de votre API)
-- cfg : event_id, nb VIP, prix VIP, nb EARLY_BIRD, prix, nb STANDARD, prix, % vendus
-- SOLD si (rn*37)%100 < sold_pct ; RESERVED si (rn*53)%100 < 8 ; sinon AVAILABLE
WITH cfg (event_id, vip_n, vip_p, eb_n, eb_p, std_n, std_p, sold_pct) AS (
  VALUES
    ('E00001', 20, 150, 40,  40, 140,  60,  55),
    ('E00002', 15, 250, 30,  90, 105, 140,  40),
    ('E00003', 10,  80, 20,  25,  70,  40,  90),
    ('E00004',  0,   0,  0,   0,   0,   0,   0),
    ('E00005', 10, 120, 50,  20, 140,  35,  35),
    ('E00006', 10,  90, 30,  15, 110,  25,  62),
    ('E00007',  0,   0, 25,  10,  75,  18,  28),
    ('E00008',  0,   0, 20,   8,  80,  12, 100),
    ('E00009', 12,  70, 20,  20,  68,  35,  70),
    ('E00010', 20, 300, 40, 120, 140, 180,  18),
    ('E00011', 15, 130, 25,  45, 110,  70,  33),
    ('E00012',  2, 150,  3,  40,   7,  60,  50)
),
raw AS (
  SELECT event_id, 1 AS ord, 'VIP'::text        AS t, vip_p AS price, g, sold_pct FROM cfg, generate_series(1, vip_n) AS g
  UNION ALL
  SELECT event_id, 2,        'EARLY_BIRD'::text,       eb_p,         g, sold_pct FROM cfg, generate_series(1, eb_n)  AS g
  UNION ALL
  SELECT event_id, 3,        'STANDARD'::text,         std_p,        g, sold_pct FROM cfg, generate_series(1, std_n) AS g
),
numbered AS (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY event_id ORDER BY ord, g) AS rn FROM raw
),
typed AS (
  SELECT *,
    CASE WHEN (rn * 37) % 100 < sold_pct THEN 'SOLD'
         WHEN (rn * 53) % 100 < 8        THEN 'RESERVED'
         ELSE 'AVAILABLE' END AS st
  FROM numbered
)
INSERT INTO "Ticket" (ticket_id, ticket_type, ticket_price, ticket_status, user_id, event_id)
SELECT
  event_id || 'TKT' || rn,
  t::"Type",
  price,
  st::"Status",
  CASE WHEN st <> 'AVAILABLE'
       THEN (ARRAY['USR0001','USR0002','USR0003','USR0004','USR0005','USR0006','USR0007','USR0008'])[1 + (rn % 8)]
       ELSE NULL END,
  event_id
FROM typed;

-- ---------- MESSAGES ----------
INSERT INTO "Message" (message_id, message_subject, message_content, message_date, user_id) VALUES
  ('M0001', 'Problème de paiement', 'Mon paiement a été débité mais je n''ai pas reçu mon billet.',                  NOW() - INTERVAL '3 days',  'USR0001'),
  ('M0002', 'Remboursement',        'Pouvez-vous me rembourser mon billet pour le gala annulé ?',                    NOW() - INTERVAL '2 days',  'USR0002'),
  ('M0003', 'Billets VIP',          'Que comprend exactement l''offre VIP du festival ?',                            NOW() - INTERVAL '1 day',   'USR0003'),
  ('M0004', 'Accès PMR',            'Le Palais des Congrès est-il accessible aux personnes à mobilité réduite ?',    NOW() - INTERVAL '1 day',   'USR0006'),
  ('M0005', 'Événement complet',    'La Nuit du Cinéma est complète, y aura-t-il une seconde date ?',                NOW() - INTERVAL '12 hours','USR0007'),
  ('M0006', NULL,                   'Merci pour l''organisation, super expérience !',                                NOW(),                      'USR0005');

COMMIT;

-- ---------- Vérification ----------
SELECT e.event_id, e.event_name, e.event_status,
       COUNT(t.*)                                              AS total,
       COUNT(*) FILTER (WHERE t.ticket_status = 'SOLD')        AS sold,
       COUNT(*) FILTER (WHERE t.ticket_status = 'RESERVED')    AS reserved,
       COUNT(*) FILTER (WHERE t.ticket_status = 'AVAILABLE')   AS available
FROM "Event" e LEFT JOIN "Ticket" t ON t.event_id = e.event_id
GROUP BY e.event_id, e.event_name, e.event_status
ORDER BY e.event_id;
