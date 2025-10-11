/*
  Warnings:

  - You are about to drop the `Supplement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SupplementReference" DROP CONSTRAINT "SupplementReference_supplementId_fkey";

-- DropTable
DROP TABLE "public"."Supplement";

-- CreateTable
CREATE TABLE "supplement" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(190) NOT NULL,
    "name" VARCHAR(190) NOT NULL,
    "synonyms" TEXT[],
    "category" VARCHAR(120),
    "summary" TEXT,
    "description" TEXT NOT NULL,
    "sideEffects" TEXT NOT NULL,
    "contraindications" TEXT NOT NULL,
    "regulatoryStatus" VARCHAR(120),
    "evidenceLevel" VARCHAR(120),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "supplement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "supplement_slug_key" ON "supplement"("slug");

-- CreateIndex
CREATE INDEX "supplement_name_idx" ON "supplement"("name");

-- CreateIndex
CREATE INDEX "supplement_category_idx" ON "supplement"("category");

-- CreateIndex
CREATE INDEX "supplement_tags_idx" ON "supplement"("tags");

-- AddForeignKey
ALTER TABLE "SupplementReference" ADD CONSTRAINT "SupplementReference_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
