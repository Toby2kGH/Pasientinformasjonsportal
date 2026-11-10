-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TreatmentType" AS ENUM ('CHEMOTHERAPY', 'IMMUNOTHERAPY', 'TARGETED_THERAPY', 'HORMONE_THERAPY', 'COMBINATION');

-- CreateEnum
CREATE TYPE "AdministrationRoute" AS ENUM ('INTRAVENOUS', 'ORAL', 'SUBCUTANEOUS', 'COMBINATION_IV_ORAL');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('INTRODUCTION', 'INDICATION', 'PREPARATION', 'ADMINISTRATION', 'SIDE_EFFECTS', 'NAUSEA_MANAGEMENT', 'DIETARY_ADVICE', 'FERTILITY', 'GENERAL_ADVICE', 'IMPORTANT_INFO');

-- CreateEnum
CREATE TYPE "SideEffectFreq" AS ENUM ('VERY_COMMON', 'COMMON', 'UNCOMMON', 'RARE', 'VARIABLE');

-- CreateEnum
CREATE TYPE "AlertUrgency" AS ENUM ('EMERGENCY', 'URGENT', 'SOON', 'ROUTINE');

-- CreateTable
CREATE TABLE "HealthRegion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthRegion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "regionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "emergencyPhone" TEXT,
    "openingHours" TEXT,
    "email" TEXT,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TumorGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "iconName" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TumorGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regimen" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "genericNames" TEXT[],
    "brandNames" TEXT[],
    "synonyms" TEXT[],
    "tumorGroupId" TEXT NOT NULL,
    "treatmentType" "TreatmentType" NOT NULL,
    "administrationRoute" "AdministrationRoute" NOT NULL,
    "cycleDescription" TEXT,
    "numberOfCycles" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "publishStatus" "PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "lastReviewedBy" TEXT,
    "approvedByFirst" TEXT,
    "approvedBySecond" TEXT,
    "approvedAt" TIMESTAMP(3),
    "sourceReference" TEXT,
    "cytodoseCode" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "searchVector" tsvector,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Regimen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientInfoSection" (
    "id" TEXT NOT NULL,
    "regimenId" TEXT NOT NULL,
    "sectionType" "SectionType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientInfoSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SideEffect" (
    "id" TEXT NOT NULL,
    "regimenId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "frequency" "SideEffectFreq" NOT NULL,
    "severity" TEXT,
    "management" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SideEffect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertInstruction" (
    "id" TEXT NOT NULL,
    "regimenId" TEXT NOT NULL,
    "urgency" "AlertUrgency" NOT NULL,
    "instruction" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AlertInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Premedication" (
    "id" TEXT NOT NULL,
    "regimenId" TEXT NOT NULL,
    "medication" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Premedication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "favoriteHospitalId" TEXT,
    "favoriteDepartmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changeData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HealthRegion_name_key" ON "HealthRegion"("name");

-- CreateIndex
CREATE INDEX "Hospital_regionId_idx" ON "Hospital"("regionId");

-- CreateIndex
CREATE INDEX "Department_hospitalId_idx" ON "Department"("hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "TumorGroup_name_key" ON "TumorGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TumorGroup_slug_key" ON "TumorGroup"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Regimen_slug_key" ON "Regimen"("slug");

-- CreateIndex
CREATE INDEX "Regimen_tumorGroupId_idx" ON "Regimen"("tumorGroupId");

-- CreateIndex
CREATE INDEX "Regimen_slug_idx" ON "Regimen"("slug");

-- CreateIndex
CREATE INDEX "Regimen_publishStatus_idx" ON "Regimen"("publishStatus");

-- CreateIndex
CREATE INDEX "Regimen_searchVector_idx" ON "Regimen" USING GIN ("searchVector");

-- CreateIndex
CREATE INDEX "PatientInfoSection_regimenId_idx" ON "PatientInfoSection"("regimenId");

-- CreateIndex
CREATE INDEX "SideEffect_regimenId_idx" ON "SideEffect"("regimenId");

-- CreateIndex
CREATE INDEX "AlertInstruction_regimenId_idx" ON "AlertInstruction"("regimenId");

-- CreateIndex
CREATE INDEX "Premedication_regimenId_idx" ON "Premedication"("regimenId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_sessionId_key" ON "UserPreference"("sessionId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "HealthRegion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regimen" ADD CONSTRAINT "Regimen_tumorGroupId_fkey" FOREIGN KEY ("tumorGroupId") REFERENCES "TumorGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientInfoSection" ADD CONSTRAINT "PatientInfoSection_regimenId_fkey" FOREIGN KEY ("regimenId") REFERENCES "Regimen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SideEffect" ADD CONSTRAINT "SideEffect_regimenId_fkey" FOREIGN KEY ("regimenId") REFERENCES "Regimen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertInstruction" ADD CONSTRAINT "AlertInstruction_regimenId_fkey" FOREIGN KEY ("regimenId") REFERENCES "Regimen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Premedication" ADD CONSTRAINT "Premedication_regimenId_fkey" FOREIGN KEY ("regimenId") REFERENCES "Regimen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

