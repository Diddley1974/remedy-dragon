// import fs from "fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import "dotenv/config";

console.log("Seeding content…");
console.log("[DEBUG] DATABASE_URL =", process.env.DATABASE_URL?.slice(0, 40) + "…");

const prisma = new PrismaClient();
const seedsDir = path.join(process.cwd(), "prisma", "seeds");

/* function readCSV(name: string) {
  const p = path.join(seedsDir, name);
  if (!fs.existsSync(p)) return [];
  const txt = fs.readFileSync(p, "utf8");
  return parse(txt, { columns: true, skip_empty_lines: true, trim: true });
} */

function readCSV(name: string) {
  const p = path.join(__dirname, "..", "seeds", name); // adjust path to your seeds folder
  const text = readFileSync(p, "utf8");
  return parse(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true, // <-- IMPORTANT on Windows to strip UTF-8 BOM
  }) as Record<string, string>[];
}

async function upsertReferencesByUrls(urls: string[]) {
  const ids: string[] = [];
  for (const url of urls) {
    const title = url; // fallback title
    const ref = await prisma.reference.upsert({
      where: { url },
      update: {},
      create: { url, title, source: "Unknown" },
    });
    ids.push(ref.id);
  }
  return ids;
}

async function seedSupplements() {
  const rows = readCSV("supplements.csv");
  for (const r of rows) {
    const rec = await prisma.supplement.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        synonyms: (r.synonyms || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        category: r.category || null,
        description: r.description || "",
        sideEffects: r.sideEffects || "",
        contraindications: r.contraindications || "",
        regulatoryStatus: r.regulatoryStatus || null,
        evidenceLevel: r.evidenceLevel || null,
        tags: (r.tags || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      },
      create: {
        slug: r.slug,
        name: r.name,
        synonyms: (r.synonyms || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
        category: r.category || null,
        description: r.description || "",
        sideEffects: r.sideEffects || "",
        contraindications: r.contraindications || "",
        regulatoryStatus: r.regulatoryStatus || null,
        evidenceLevel: r.evidenceLevel || null,
        tags: (r.tags || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      },
    });

    // optional: link example reference by URL
    // (if you add a "referenceUrls" column to supplements.csv, wire it like interactions below)
  }
  console.log(`Supplements: ${rows.length}`);
}

async function seedTcm() {
  const rows = readCSV("tcm.csv");
  for (const r of rows) {
    const remedy = await prisma.tcmRemedy.upsert({
      where: { slug: r.slug },
      update: {
        namePinyin: r.namePinyin,
        nameEnglish: r.nameEnglish,
        indications: r.indications || "",
        notes: r.notes || "",
        contraindications: r.contraindications || "",
      },
      create: {
        slug: r.slug,
        namePinyin: r.namePinyin,
        nameEnglish: r.nameEnglish,
        indications: r.indications || "",
        notes: r.notes || "",
        contraindications: r.contraindications || "",
      },
    });

    // reset and insert ingredients
    await prisma.tcmIngredient.deleteMany({ where: { remedyId: remedy.id } });
    const parts = (r.ingredients || "")
      .split(";")
      .map((s: string) => s.trim())
      .filter(Boolean);
    for (const p of parts) {
      const [english, pinyin, amount] = p.split("|").map((x) => (x || "").trim());
      await prisma.tcmIngredient.create({
        data: { remedyId: remedy.id, english, pinyin, amount: amount || null },
      });
    }
  }
  console.log(`TCM remedies: ${rows.length}`);
}

async function seedConditions() {
  const rows = readCSV("conditions.csv");
  for (const r of rows) {
    await prisma.condition.upsert({
      where: { slug: r.slug },
      update: {
        title: r.title,
        overview: r.overview || "",
        redFlags: r.redFlags || "",
      },
      create: {
        slug: r.slug,
        title: r.title,
        overview: r.overview || "",
        redFlags: r.redFlags || "",
      },
    });
  }
  console.log(`Conditions: ${rows.length}`);
}
/*
async function seedReferences() {
  const rows = readCSV("references.csv");
  for (const r of rows) {
    const year = r.year ? Number(r.year) : null;
    await prisma.reference.upsert({
      where: { url: r.url },
      update: { title: r.title || r.url, source: r.source || "Unknown", year: year ?? undefined },
      create: { url: r.url, title: r.title || r.url, source: r.source || "Unknown", year: year ?? undefined },
    });
  }
  console.log(`References: ${rows.length}`);
}
*/
async function seedReferences() {
  const rows = readCSV("references.csv");
  for (const r of rows) {
    const url = (r.url ?? "").trim(); // normalize
    if (!url) {
      // guard against empty/garbled header
      console.warn("Skipping reference row without url:", r);
      continue;
    }
    const title = (r.title ?? "").trim();
    const source = (r.source ?? "").trim();
    const year = r.year ? Number.parseInt(r.year, 10) : null;

    await prisma.reference.upsert({
      where: { url }, // now definitely defined
      create: { url, title, source, year: year ?? undefined },
      update: { title, source, year: year ?? undefined },
    });
  }
}

async function seedInteractions() {
  const rows = readCSV("interactions.csv");
  for (const r of rows) {
    const interaction = await prisma.interaction.upsert({
      where: { id: `${r.substanceA}__${r.substanceB}`.toLowerCase().replace(/\s+/g, "_") },
      update: {
        substanceA: r.substanceA,
        substanceB: r.substanceB,
        severity: r.severity,
        mechanism: r.mechanism || "",
        notes: r.notes || "",
      },
      create: {
        id: `${r.substanceA}__${r.substanceB}`.toLowerCase().replace(/\s+/g, "_"),
        substanceA: r.substanceA,
        substanceB: r.substanceB,
        severity: r.severity,
        mechanism: r.mechanism || "",
        notes: r.notes || "",
      },
    });

    // link references by URLs (comma-separated)
    const urls = (r.referenceUrls || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    const refIds = await upsertReferencesByUrls(urls);
    // clear old links then link
    await prisma.interactionReference.deleteMany({ where: { interactionId: interaction.id } });
    for (const refId of refIds) {
      await prisma.interactionReference.upsert({
        where: { interactionId_referenceId: { interactionId: interaction.id, referenceId: refId } },
        update: {},
        create: { interactionId: interaction.id, referenceId: refId },
      });
    }
  }
  console.log(`Interactions: ${rows.length}`);
}

async function seedSymptomsAndRules() {
  const sRows = readCSV("symptoms.csv");
  for (const r of sRows) {
    await prisma.symptom.upsert({
      where: { slug: r.slug },
      update: {
        name: r.name,
        synonyms: (r.synonyms || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      },
      create: {
        slug: r.slug,
        name: r.name,
        synonyms: (r.synonyms || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      },
    });
  }

  type Row = { id: string; slug: string | null };

  const cIndex: Record<string, string> = {};
  const conditions = await prisma.condition.findMany({
    select: { id: true, slug: true },
  });

  conditions.forEach((c: Row) => {
    if (c.slug) cIndex[c.slug] = c.id;
  });

  const rRows = readCSV("rules.csv");
  for (const r of rRows) {
    const condId = cIndex[r.conditionSlug];
    if (!condId) {
      console.warn(`Rule skipped (unknown condition): ${r.conditionSlug}`);
      continue;
    }
    const symptomSlugs = (r.symptomSlugs || "")
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
    const minMatch = Number(r.minMatch || 1);
    await prisma.rule.create({
      data: { conditionId: condId, symptomSlugs, minMatch, notes: r.notes || null },
    });
  }
  console.log(`Symptoms: ${sRows.length} | Rules: ${rRows.length}`);
}

async function main() {
  console.log("Seeding content…");
  await seedReferences();
  await seedSupplements();
  await seedTcm();
  await seedConditions();
  await seedInteractions();
  await seedSymptomsAndRules();
  console.log("Done.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect().finally(() => process.exit(1));
  });
