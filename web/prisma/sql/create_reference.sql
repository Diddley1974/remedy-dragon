-- Create the Reference table if it doesn't exist yet.
-- This matches the Prisma model:
-- model Reference { id String @id @default(cuid()); url String @unique; title String; source String; year Int? }
CREATE TABLE IF NOT EXISTS "Reference" (
  "id"    TEXT PRIMARY KEY,         -- Prisma supplies cuid(); no DB default needed
  "url"   TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "source" VARCHAR(120) NOT NULL,
  "year"  INTEGER
);
