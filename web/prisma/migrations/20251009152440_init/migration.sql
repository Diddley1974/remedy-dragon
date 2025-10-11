-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PRACTITIONER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('PRIVACY_POLICY', 'DATA_PROCESSING', 'MARKETING');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('MINOR', 'MODERATE', 'MAJOR');

CREATE EXTENSION IF NOT EXISTS citext;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" CITEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" VARCHAR(190),
    "age" INTEGER,
    "sex" VARCHAR(32),
    "medications" TEXT[],
    "conditions" TEXT[],
    "marketingOk" BOOLEAN NOT NULL DEFAULT false,
    "researchOk" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PractitionerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialties" TEXT[],
    "qualifications" TEXT[],
    "insuranceUrl" TEXT,
    "kycStatus" "KycStatus" NOT NULL DEFAULT 'PENDING',
    "stripeAccountId" VARCHAR(255),
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PractitionerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "ConsentType" NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "withdrawn" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Consent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplement" (
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

    CONSTRAINT "Supplement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TcmRemedy" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(190) NOT NULL,
    "namePinyin" VARCHAR(190) NOT NULL,
    "nameEnglish" VARCHAR(190) NOT NULL,
    "indications" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "contraindications" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TcmRemedy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TcmIngredient" (
    "id" TEXT NOT NULL,
    "remedyId" TEXT NOT NULL,
    "english" VARCHAR(190) NOT NULL,
    "pinyin" VARCHAR(190),
    "amount" VARCHAR(64),

    CONSTRAINT "TcmIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(190) NOT NULL,
    "title" VARCHAR(190) NOT NULL,
    "overview" TEXT NOT NULL,
    "redFlags" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Symptom" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(190) NOT NULL,
    "name" VARCHAR(190) NOT NULL,
    "synonyms" TEXT[],

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rule" (
    "id" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "symptomSlugs" TEXT[],
    "minMatch" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SymptomLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "symptomSlugs" TEXT[],
    "resultIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "substanceA" VARCHAR(190) NOT NULL,
    "substanceB" VARCHAR(190) NOT NULL,
    "severity" "Severity" NOT NULL,
    "mechanism" TEXT,
    "notes" TEXT,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reference" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" VARCHAR(120) NOT NULL,
    "year" INTEGER,

    CONSTRAINT "Reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplementReference" (
    "supplementId" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,

    CONSTRAINT "SupplementReference_pkey" PRIMARY KEY ("supplementId","referenceId")
);

-- CreateTable
CREATE TABLE "TcmRemedyReference" (
    "tcmRemedyId" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,

    CONSTRAINT "TcmRemedyReference_pkey" PRIMARY KEY ("tcmRemedyId","referenceId")
);

-- CreateTable
CREATE TABLE "ConditionReference" (
    "conditionId" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,

    CONSTRAINT "ConditionReference_pkey" PRIMARY KEY ("conditionId","referenceId")
);

-- CreateTable
CREATE TABLE "InteractionReference" (
    "interactionId" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,

    CONSTRAINT "InteractionReference_pkey" PRIMARY KEY ("interactionId","referenceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PractitionerProfile_userId_key" ON "PractitionerProfile"("userId");

-- CreateIndex
CREATE INDEX "Consent_type_idx" ON "Consent"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Consent_userId_type_key" ON "Consent"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Supplement_slug_key" ON "Supplement"("slug");

-- CreateIndex
CREATE INDEX "Supplement_name_idx" ON "Supplement"("name");

-- CreateIndex
CREATE INDEX "Supplement_category_idx" ON "Supplement"("category");

-- CreateIndex
CREATE INDEX "Supplement_tags_idx" ON "Supplement"("tags");

-- CreateIndex
CREATE UNIQUE INDEX "TcmRemedy_slug_key" ON "TcmRemedy"("slug");

-- CreateIndex
CREATE INDEX "TcmRemedy_nameEnglish_idx" ON "TcmRemedy"("nameEnglish");

-- CreateIndex
CREATE INDEX "TcmRemedy_namePinyin_idx" ON "TcmRemedy"("namePinyin");

-- CreateIndex
CREATE UNIQUE INDEX "Condition_slug_key" ON "Condition"("slug");

-- CreateIndex
CREATE INDEX "Condition_title_idx" ON "Condition"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_slug_key" ON "Symptom"("slug");

-- CreateIndex
CREATE INDEX "Rule_conditionId_idx" ON "Rule"("conditionId");

-- CreateIndex
CREATE INDEX "SymptomLog_userId_createdAt_idx" ON "SymptomLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Interaction_substanceA_substanceB_idx" ON "Interaction"("substanceA", "substanceB");

-- CreateIndex
CREATE INDEX "Interaction_severity_idx" ON "Interaction"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "Reference_url_key" ON "Reference"("url");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PractitionerProfile" ADD CONSTRAINT "PractitionerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consent" ADD CONSTRAINT "Consent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TcmIngredient" ADD CONSTRAINT "TcmIngredient_remedyId_fkey" FOREIGN KEY ("remedyId") REFERENCES "TcmRemedy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SymptomLog" ADD CONSTRAINT "SymptomLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementReference" ADD CONSTRAINT "SupplementReference_supplementId_fkey" FOREIGN KEY ("supplementId") REFERENCES "Supplement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplementReference" ADD CONSTRAINT "SupplementReference_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "Reference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TcmRemedyReference" ADD CONSTRAINT "TcmRemedyReference_tcmRemedyId_fkey" FOREIGN KEY ("tcmRemedyId") REFERENCES "TcmRemedy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TcmRemedyReference" ADD CONSTRAINT "TcmRemedyReference_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "Reference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionReference" ADD CONSTRAINT "ConditionReference_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConditionReference" ADD CONSTRAINT "ConditionReference_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "Reference"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionReference" ADD CONSTRAINT "InteractionReference_interactionId_fkey" FOREIGN KEY ("interactionId") REFERENCES "Interaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InteractionReference" ADD CONSTRAINT "InteractionReference_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "Reference"("id") ON DELETE CASCADE ON UPDATE CASCADE;
