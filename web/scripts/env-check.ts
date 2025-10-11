import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL ?? "";
console.log("DATABASE_URL:", url.replace(/:\/\/.*@/, "://***@"));

const prisma = new PrismaClient({ log: ["error"] });

async function main() {
  const searchPath = await prisma.$queryRawUnsafe<{ search_path: string }[]>(`show search_path`);
  const tables = await prisma.$queryRaw<{ table_name: string }[]>`
    select table_name from information_schema.tables
    where table_schema='public' order by 1
  `;
  console.log("search_path:", searchPath?.[0]?.search_path);
  console.log(
    "public tables:",
    tables.map((t) => t.table_name),
  );
  await prisma.$disconnect();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
