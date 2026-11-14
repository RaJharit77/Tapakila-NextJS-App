// prisma/seed.ts
import "dotenv/config";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Type, Status, EventStatus } from "../generated/prisma";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const daysFromNow = (d: number) => new Date(Date.now() + d * 24 * 60 * 60 * 1000);

async function main() {
  console.log("🧹 Nettoyage des tables...");
  // Ordre important à cause des clés étrangères
  await prisma.message.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // ---------- ADMINS ----------
  console.log("👤 Création des admins...");
  const admins = [
    { admin_id: randomUUID(), admin_name: "Alice Admin", admin_mail: "alice@events.com", admin_password: passwordHash },
    { admin_id: randomUUID(), admin_name: "Bob Manager", admin_mail: "bob@events.com", admin_password: passwordHash },
  ];
  await prisma.admin.createMany({ data: admins });

  // ---------- USERS ----------
  console.log("🙋 Création des users...");
  const users = [
    { user_id: randomUUID(), user_name: "Claire Martin", user_email: "claire@mail.com", user_city: "Paris", user_address: "12 rue de Rivoli" },
    { user_id: randomUUID(), user_name: "David Dupont", user_email: "david@mail.com", user_city: "Lyon", user_address: "5 place Bellecour" },
    { user_id: randomUUID(), user_name: "Emma Leroy", user_email: "emma@mail.com", user_city: "Marseille", user_address: null },
    { user_id: randomUUID(), user_name: "Farid Benali", user_email: "farid@mail.com", user_city: null, user_address: null },
    { user_id: randomUUID(), user_name: "Giulia Rossi", user_email: "giulia@mail.com", user_city: "Nice", user_address: "8 promenade des Anglais" },
  ].map((u) => ({
    ...u,
    user_password: passwordHash,
    user_first_login_date: daysFromNow(-Math.floor(Math.random() * 90)),
  }));
  await prisma.user.createMany({ data: users });

  // ---------- EVENTS ----------
  console.log("🎉 Création des events...");
  const events = [
    {
      event_id: randomUUID(),
      event_name: "Festival Électro Summer",
      event_date: daysFromNow(30),
      event_place: "Parc des Expositions",
      event_description: "Deux jours de musique électronique avec les meilleurs DJs.",
      event_image: "https://picsum.photos/seed/electro/800/400",
      admin_id: admins[0].admin_id,
      event_organizer: "Summer Productions",
      event_status: EventStatus.UPLOADED,
      event_category: "Musique",
      event_tickets_limit_by_user_by_type: 5,
    },
    {
      event_id: randomUUID(),
      event_name: "Conférence Tech & IA 2026",
      event_date: daysFromNow(45),
      event_place: "Palais des Congrès",
      event_description: "Conférences et ateliers sur l'intelligence artificielle.",
      event_image: "https://picsum.photos/seed/tech/800/400",
      admin_id: admins[1].admin_id,
      event_organizer: "TechWorld",
      event_status: EventStatus.UPLOADED,
      event_category: "Conférence",
      event_tickets_limit_by_user_by_type: 3,
    },
    {
      event_id: randomUUID(),
      event_name: "Soirée Stand-up Comedy",
      event_date: daysFromNow(10),
      event_place: "Théâtre Municipal",
      event_description: "Cinq humoristes sur scène pour une soirée de rire.",
      event_image: "https://picsum.photos/seed/comedy/800/400",
      admin_id: admins[0].admin_id,
      event_organizer: "Rire Ensemble",
      event_status: EventStatus.UPLOADED,
      event_category: "Humour",
      event_tickets_limit_by_user_by_type: 4,
    },
    {
      event_id: randomUUID(),
      event_name: "Tournoi E-sport Arena",
      event_date: daysFromNow(60),
      event_place: "Arena Gaming Center",
      event_description: null,
      event_image: null,
      admin_id: admins[1].admin_id,
      event_organizer: "Arena Gaming",
      event_status: EventStatus.DRAFT,
      event_category: "Gaming",
      event_tickets_limit_by_user_by_type: 5,
    },
    {
      event_id: randomUUID(),
      event_name: "Gala de Charité (annulé)",
      event_date: daysFromNow(-5),
      event_place: "Hôtel Grand Palace",
      event_description: "Soirée de gala au profit d'associations locales.",
      event_image: "https://picsum.photos/seed/gala/800/400",
      admin_id: admins[0].admin_id,
      event_organizer: "Fondation Solidaire",
      event_status: EventStatus.CANCLED,
      event_category: "Charité",
      event_tickets_limit_by_user_by_type: 2,
    },
  ];
  await prisma.event.createMany({ data: events });

  // ---------- TICKETS ----------
  console.log("🎟️  Création des tickets...");
  const prices: Record<Type, number> = {
    [Type.VIP]: 150,
    [Type.EARLY_BIRD]: 40,
    [Type.STANDARD]: 60,
  };

  const tickets: {
    ticket_id: string;
    ticket_type: Type;
    ticket_price: number;
    ticket_status: Status;
    user_id: string | null;
    event_id: string;
  }[] = [];

  for (const event of events) {
    // 12 tickets par event : 2 VIP, 3 EARLY_BIRD, 7 STANDARD
    for (let n = 1; n <= 12; n++) {
      const type = n <= 2 ? Type.VIP : n <= 5 ? Type.EARLY_BIRD : Type.STANDARD;

      let status: Status = Status.AVAILABLE;
      let user_id: string | null = null;

      if ([1, 3, 6, 8].includes(n)) {
        status = Status.SOLD;
        user_id = users[n % users.length].user_id;
      } else if (n === 7) {
        status = Status.RESERVED;
        user_id = users[(n + 1) % users.length].user_id;
      }

      tickets.push({
        ticket_id: randomUUID(),
        ticket_type: type,
        ticket_price: prices[type],
        ticket_status: status,
        user_id,
        event_id: event.event_id,
      });
    }
  }
  await prisma.ticket.createMany({ data: tickets });

  // ---------- MESSAGES ----------
  console.log("💬 Création des messages...");
  await prisma.message.createMany({
    data: [
      {
        message_id: randomUUID(),
        message_subject: "Problème de paiement",
        message_content: "Bonjour, mon paiement a été débité mais je n'ai pas reçu mon billet.",
        message_date: daysFromNow(-3),
        user_id: users[0].user_id,
      },
      {
        message_id: randomUUID(),
        message_subject: "Remboursement",
        message_content: "Pouvez-vous me rembourser mon billet pour le gala annulé ?",
        message_date: daysFromNow(-2),
        user_id: users[1].user_id,
      },
      {
        message_id: randomUUID(),
        message_subject: "Question sur les billets VIP",
        message_content: "Que comprend exactement l'offre VIP du festival ?",
        message_date: daysFromNow(-1),
        user_id: users[2].user_id,
      },
      {
        message_id: randomUUID(),
        message_subject: null,
        message_content: "Merci pour l'organisation, super expérience !",
        message_date: new Date(),
        user_id: users[4].user_id,
      },
    ],
  });

  console.log("✅ Seed terminé avec succès !");
  console.log(`   ${admins.length} admins, ${users.length} users, ${events.length} events, ${tickets.length} tickets, 4 messages`);
  console.log("   Mot de passe de tous les comptes : Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
