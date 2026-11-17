import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, AdminRole, EventStatus, Status, Type } from "../generated/prisma";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/** Date dans `days` jours, à `hour`h00 (UTC) */
const inDays = (days: number, hour = 20) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  d.setUTCHours(hour, 0, 0, 0);
  return d;
};
const ago = (days: number) => new Date(Date.now() - days * 86_400_000);

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL ?? "superadmin@events.com";
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD ?? "SuperAdmin123!";
const DEFAULT_PASSWORD = "Password123!";

type TierConfig = [count: number, price: number];
interface EventSeed {
  id: string;
  name: string;
  inDays: number;
  hour: number;
  place: string;
  description: string | null;
  image: string | null;
  admin: string;
  organizer: string;
  status: EventStatus;
  category: string;
  limit: number;
  vip: TierConfig;
  early: TierConfig;
  std: TierConfig;
  soldPct: number; // % de tickets vendus
}

const EVENTS: EventSeed[] = [
  {
    id: "E00001", name: "Festival Électro Summer", inDays: 30, hour: 18,
    place: "Parc des Expositions",
    description: "Deux jours de musique électronique avec les meilleurs DJs internationaux et trois scènes.",
    image: "https://picsum.photos/seed/electro/800/400",
    admin: "ADM0002", organizer: "Summer Productions", status: EventStatus.UPLOADED,
    category: "Musique", limit: 5, vip: [20, 150], early: [40, 40], std: [140, 60], soldPct: 55,
  },
  {
    id: "E00002", name: "Conférence Tech & IA 2026", inDays: 45, hour: 9,
    place: "Palais des Congrès",
    description: "Conférences, démos et ateliers sur l'intelligence artificielle et le cloud.",
    image: "https://picsum.photos/seed/tech/800/400",
    admin: "ADM0003", organizer: "TechWorld", status: EventStatus.UPLOADED,
    category: "Conférence", limit: 3, vip: [15, 250], early: [30, 90], std: [105, 140], soldPct: 40,
  },
  {
    id: "E00003", name: "Soirée Stand-up Comedy", inDays: 10, hour: 20,
    place: "Théâtre Municipal",
    description: "Cinq humoristes sur scène pour une soirée de rire garantie.",
    image: "https://picsum.photos/seed/comedy/800/400",
    admin: "ADM0002", organizer: "Rire Ensemble", status: EventStatus.UPLOADED,
    category: "Humour", limit: 4, vip: [10, 80], early: [20, 25], std: [70, 40], soldPct: 90,
  },
  {
    id: "E00004", name: "Tournoi E-sport Arena", inDays: 60, hour: 14,
    place: "Arena Gaming Center",
    description: null, image: null,
    admin: "ADM0003", organizer: "Arena Gaming", status: EventStatus.DRAFT,
    category: "Gaming", limit: 5, vip: [0, 0], early: [0, 0], std: [0, 0], soldPct: 0,
  },
  {
    id: "E00005", name: "Marathon de la Ville", inDays: 75, hour: 7,
    place: "Place de l'Hôtel de Ville",
    description: "Marathon, semi-marathon et 10 km ouverts à tous les niveaux.",
    image: "https://picsum.photos/seed/marathon/800/400",
    admin: "ADM0002", organizer: "Club Athlétisme Métropole", status: EventStatus.UPLOADED,
    category: "Sport", limit: 5, vip: [10, 120], early: [50, 20], std: [140, 35], soldPct: 35,
  },
  {
    id: "E00006", name: "Salon de la Gastronomie", inDays: 20, hour: 10,
    place: "Halle des Saveurs",
    description: "Dégustations, démonstrations de chefs et marché de producteurs locaux.",
    image: "https://picsum.photos/seed/food/800/400",
    admin: "ADM0003", organizer: "Gourmet Events", status: EventStatus.UPLOADED,
    category: "Gastronomie", limit: 6, vip: [10, 90], early: [30, 15], std: [110, 25], soldPct: 62,
  },
  {
    id: "E00007", name: "Exposition d'Art Contemporain", inDays: 38, hour: 11,
    place: "Musée des Arts Modernes",
    description: "Une centaine d'œuvres d'artistes émergents, avec visites guidées.",
    image: "https://picsum.photos/seed/art/800/400",
    admin: "ADM0002", organizer: "Galerie Horizon", status: EventStatus.UPLOADED,
    category: "Art", limit: 8, vip: [0, 0], early: [25, 10], std: [75, 18], soldPct: 28,
  },
  {
    id: "E00008", name: "Nuit du Cinéma en plein air", inDays: 14, hour: 21,
    place: "Esplanade du Lac",
    description: "Trois films cultes projetés sur écran géant, plaids et pop-corn inclus.",
    image: "https://picsum.photos/seed/cinema/800/400",
    admin: "ADM0003", organizer: "Ciné Nomade", status: EventStatus.UPLOADED,
    category: "Cinéma", limit: 6, vip: [0, 0], early: [20, 8], std: [80, 12], soldPct: 100, // complet
  },
  {
    id: "E00009", name: "Théâtre : Le Dernier Acte", inDays: 25, hour: 20,
    place: "Théâtre des Variétés",
    description: "Une comédie dramatique en trois actes portée par une troupe de dix comédiens.",
    image: "https://picsum.photos/seed/theatre/800/400",
    admin: "ADM0002", organizer: "Compagnie Les Planches", status: EventStatus.UPLOADED,
    category: "Théâtre", limit: 4, vip: [12, 70], early: [20, 20], std: [68, 35], soldPct: 70,
  },
  {
    id: "E00010", name: "Business Summit Startups", inDays: 90, hour: 9,
    place: "Centre d'Affaires International",
    description: "Pitchs, networking et tables rondes avec fondateurs et investisseurs.",
    image: "https://picsum.photos/seed/business/800/400",
    admin: "ADM0001", organizer: "Startup Hub", status: EventStatus.UPLOADED,
    category: "Business", limit: 3, vip: [20, 300], early: [40, 120], std: [140, 180], soldPct: 18,
  },
  {
    id: "E00011", name: "Concert de l'Orchestre Symphonique", inDays: 52, hour: 19,
    place: "Auditorium Central",
    description: "Programme dédié aux grandes symphonies romantiques.",
    image: "https://picsum.photos/seed/orchestra/800/400",
    admin: "ADM0003", organizer: "Orchestre Symphonique Régional", status: EventStatus.UPLOADED,
    category: "Musique", limit: 5, vip: [15, 130], early: [25, 45], std: [110, 70], soldPct: 33,
  },
  {
    id: "E00012", name: "Gala de Charité (annulé)", inDays: -5, hour: 19,
    place: "Hôtel Grand Palace",
    description: "Soirée de gala au profit d'associations locales.",
    image: "https://picsum.photos/seed/gala/800/400",
    admin: "ADM0002", organizer: "Fondation Solidaire", status: EventStatus.CANCLED,
    category: "Charité", limit: 2, vip: [2, 150], early: [3, 40], std: [7, 60], soldPct: 50,
  },
];

async function main() {
  console.log("🧹 Nettoyage des tables...");
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();

  const defaultHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const superHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

  // ---------- ADMINS ----------
  console.log("👤 Admins...");
  await prisma.admin.createMany({
    data: [
      { admin_id: "ADM0001", admin_name: "Super Admin", admin_mail: SUPER_ADMIN_EMAIL, admin_password: superHash, admin_role: AdminRole.SUPER_ADMIN },
      { admin_id: "ADM0002", admin_name: "Alice Admin", admin_mail: "alice@events.com", admin_password: defaultHash, admin_role: AdminRole.ADMIN },
      { admin_id: "ADM0003", admin_name: "Bob Manager", admin_mail: "bob@events.com", admin_password: defaultHash, admin_role: AdminRole.ADMIN },
    ],
  });

  // ---------- USERS ----------
  console.log("🙋 Users...");
  const users = [
    { user_id: "USR0001", user_name: "Claire Martin", user_email: "claire@mail.com", user_city: "Paris", user_address: "12 rue de Rivoli", first: 80 },
    { user_id: "USR0002", user_name: "David Dupont", user_email: "david@mail.com", user_city: "Lyon", user_address: "5 place Bellecour", first: 60 },
    { user_id: "USR0003", user_name: "Emma Leroy", user_email: "emma@mail.com", user_city: "Marseille", user_address: null, first: 45 },
    { user_id: "USR0004", user_name: "Farid Benali", user_email: "farid@mail.com", user_city: null, user_address: null, first: 30 },
    { user_id: "USR0005", user_name: "Giulia Rossi", user_email: "giulia@mail.com", user_city: "Nice", user_address: "8 promenade des Anglais", first: 21 },
    { user_id: "USR0006", user_name: "Hugo Bernard", user_email: "hugo@mail.com", user_city: "Toulouse", user_address: null, first: 14 },
    { user_id: "USR0007", user_name: "Inès Moreau", user_email: "ines@mail.com", user_city: "Nantes", user_address: "3 quai de la Fosse", first: 7 },
    { user_id: "USR0008", user_name: "Jules Petit", user_email: "jules@mail.com", user_city: "Lille", user_address: null, first: 2 },
  ];
  await prisma.user.createMany({
    data: users.map(({ first, ...u }) => ({
      ...u,
      user_password: defaultHash,
      user_first_login_date: ago(first),
    })),
  });

  // ---------- EVENTS ----------
  console.log("🎉 Events...");
  await prisma.event.createMany({
    data: EVENTS.map((e) => ({
      event_id: e.id,
      event_name: e.name,
      event_date: inDays(e.inDays, e.hour),
      event_place: e.place,
      event_description: e.description,
      event_image: e.image,
      admin_id: e.admin,
      event_organizer: e.organizer,
      event_status: e.status,
      event_category: e.category,
      event_tickets_limit_by_user_by_type: e.limit,
    })),
  });

  // ---------- TICKETS ----------
  // IDs au format de votre API : E00001TKT1, E00001TKT2...
  // Statut déterministe (identique au seed.sql) :
  //   SOLD si (rn*37)%100 < soldPct, RESERVED si (rn*53)%100 < 8, sinon AVAILABLE
  console.log("🎟️  Tickets...");
  const tickets: {
    ticket_id: string;
    ticket_type: Type;
    ticket_price: number;
    ticket_status: Status;
    user_id: string | null;
    event_id: string;
  }[] = [];

  for (const e of EVENTS) {
    const tiers: [Type, TierConfig][] = [
      [Type.VIP, e.vip],
      [Type.EARLY_BIRD, e.early],
      [Type.STANDARD, e.std],
    ];
    let rn = 0;
    for (const [type, [count, price]] of tiers) {
      for (let i = 0; i < count; i++) {
        rn++;
        const status =
          (rn * 37) % 100 < e.soldPct ? Status.SOLD
          : (rn * 53) % 100 < 8 ? Status.RESERVED
          : Status.AVAILABLE;
        tickets.push({
          ticket_id: `${e.id}TKT${rn}`,
          ticket_type: type,
          ticket_price: price,
          ticket_status: status,
          user_id: status === Status.AVAILABLE ? null : users[rn % users.length].user_id,
          event_id: e.id,
        });
      }
    }
  }
  for (let i = 0; i < tickets.length; i += 1000) {
    await prisma.ticket.createMany({ data: tickets.slice(i, i + 1000) });
  }

  // ---------- MESSAGES ----------
  console.log("💬 Messages...");
  await prisma.message.createMany({
    data: [
      { message_id: "M0001", message_subject: "Problème de paiement", message_content: "Mon paiement a été débité mais je n'ai pas reçu mon billet.", message_date: ago(3), user_id: "USR0001" },
      { message_id: "M0002", message_subject: "Remboursement", message_content: "Pouvez-vous me rembourser mon billet pour le gala annulé ?", message_date: ago(2), user_id: "USR0002" },
      { message_id: "M0003", message_subject: "Billets VIP", message_content: "Que comprend exactement l'offre VIP du festival ?", message_date: ago(1), user_id: "USR0003" },
      { message_id: "M0004", message_subject: "Accès PMR", message_content: "Le Palais des Congrès est-il accessible aux personnes à mobilité réduite ?", message_date: ago(1), user_id: "USR0006" },
      { message_id: "M0005", message_subject: "Événement complet", message_content: "La Nuit du Cinéma est complète, y aura-t-il une seconde date ?", message_date: ago(0.5), user_id: "USR0007" },
      { message_id: "M0006", message_subject: null, message_content: "Merci pour l'organisation, super expérience !", message_date: new Date(), user_id: "USR0005" },
    ],
  });

  console.log(`✅ Seed terminé : 3 admins, ${users.length} users, ${EVENTS.length} events, ${tickets.length} tickets, 6 messages`);
  console.log(`   Super admin : ${SUPER_ADMIN_EMAIL} / ${SUPER_ADMIN_PASSWORD}`);
  console.log(`   Autres comptes : ${DEFAULT_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
