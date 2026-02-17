import { PrismaClient, DocumentStatus, DocumentType, MembershipRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug: "contractflow-ai" },
    update: { name: "ContractFlow AI" },
    create: {
      name: "ContractFlow AI",
      slug: "contractflow-ai",
    },
  });

  const passwordHash = await hash("password123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@contractflow.ai" },
    update: { name: "Avery Stone", passwordHash, emailVerifiedAt: new Date() },
    create: {
      email: "admin@contractflow.ai",
      name: "Avery Stone",
      passwordHash,
      emailVerifiedAt: new Date(),
    },
  });

  await prisma.membership.upsert({
    where: {
      organizationId_userId: { organizationId: organization.id, userId: user.id },
    },
    update: { role: MembershipRole.OWNER },
    create: {
      organizationId: organization.id,
      userId: user.id,
      role: MembershipRole.OWNER,
    },
  });

  const client = await prisma.client.upsert({
    where: {
      organizationId_name: { organizationId: organization.id, name: "Northwind Logistics" },
    },
    update: { industry: "Logistics" },
    create: {
      organizationId: organization.id,
      name: "Northwind Logistics",
      industry: "Logistics",
    },
  });

  const project = await prisma.project.upsert({
    where: {
      organizationId_name: { organizationId: organization.id, name: "2026 Master Services" },
    },
    update: { clientId: client.id },
    create: {
      organizationId: organization.id,
      clientId: client.id,
      name: "2026 Master Services",
      description: "Multi-year master services agreement aligned to updated compliance playbooks.",
    },
  });

  const document = await prisma.document.upsert({
    where: { publicToken: "demo-contract-2026" },
    update: {
      status: DocumentStatus.REVIEW,
      version: 3,
      title: "2026 Master Services Agreement",
    },
    create: {
      organizationId: organization.id,
      clientId: client.id,
      projectId: project.id,
      createdById: user.id,
      type: DocumentType.CONTRACT,
      status: DocumentStatus.REVIEW,
      title: "2026 Master Services Agreement",
      version: 3,
      publicToken: "demo-contract-2026",
    },
  });

  await prisma.documentSection.createMany({
    data: [
      {
        documentId: document.id,
        title: "Scope of Services",
        content:
          "Defines the managed logistics workflows, onboarding, and quarterly optimization milestones.",
        order: 1,
      },
      {
        documentId: document.id,
        title: "Security & Compliance",
        content:
          "Outlines data residency, audit rights, and zero-trust access policies required for execution.",
        order: 2,
      },
      {
        documentId: document.id,
        title: "Pricing & Payment",
        content: "Sets the tiered pricing schedule, minimum commitments, and payment terms.",
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.comment.upsert({
    where: {
      id: "seed-comment-001",
    },
    update: {
      body: "Awaiting finance confirmation on the revised payment schedule.",
    },
    create: {
      id: "seed-comment-001",
      documentId: document.id,
      authorId: user.id,
      body: "Awaiting finance confirmation on the revised payment schedule.",
    },
  });

  await prisma.template.upsert({
    where: {
      organizationId_name: { organizationId: organization.id, name: "Master Services Template" },
    },
    update: {
      description: "Standard structure for enterprise master services agreements.",
    },
    create: {
      organizationId: organization.id,
      createdById: user.id,
      name: "Master Services Template",
      description: "Standard structure for enterprise master services agreements.",
      type: DocumentType.CONTRACT,
      sections: {
        create: [
          {
            title: "Scope of Services",
            content: "Define the services, deliverables, and operational expectations.",
            order: 1,
          },
          {
            title: "Security & Compliance",
            content: "Outline data handling, audit rights, and compliance requirements.",
            order: 2,
          },
          {
            title: "Pricing & Payment",
            content: "Document pricing tiers, payment terms, and renewal cadence.",
            order: 3,
          },
        ],
      },
    },
  });
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
