-- AddColumn: publishStatus, publishedAt, synonyms, approvedBy*, approvedAt
ALTER TABLE "Regimen" ADD COLUMN IF NOT EXISTS "publishStatus" TEXT NOT NULL DEFAULT 'DRAFT';
ALTER TABLE "Regimen" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
ALTER TABLE "Regimen" ADD COLUMN IF NOT EXISTS "synonyms" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Regimen" ADD COLUMN IF NOT EXISTS "approvedByFirst" TEXT;
ALTER TABLE "Regimen" ADD COLUMN IF NOT EXISTS "approvedBySecond" TEXT;
ALTER TABLE "Regimen" ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);

-- Upgrade existing approved content (seed data counts as pre-approved)
UPDATE "Regimen" SET "publishStatus" = 'APPROVED', "publishedAt" = NOW() WHERE "isActive" = true;

-- Create PublishStatus enum (Prisma will handle the enum, but raw SQL for safety)
DO $$ BEGIN
  CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ARCHIVED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ── FULL-TEXT SEARCH ──────────────────────────────────────────────────────
-- tsvector column for Norwegian full-text search
ALTER TABLE "Regimen" ADD COLUMN IF NOT EXISTS "searchVector" tsvector;

-- Build initial vectors
UPDATE "Regimen" SET "searchVector" =
  setweight(to_tsvector('norwegian', coalesce("name", '')), 'A') ||
  setweight(to_tsvector('simple',    coalesce(array_to_string("genericNames", ' '), '')), 'B') ||
  setweight(to_tsvector('simple',    coalesce(array_to_string("brandNames", ' '), '')), 'B') ||
  setweight(to_tsvector('simple',    coalesce(array_to_string("synonyms", ' '), '')), 'B');

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS "Regimen_searchVector_idx" ON "Regimen" USING GIN("searchVector");
CREATE INDEX IF NOT EXISTS "Regimen_publishStatus_idx" ON "Regimen"("publishStatus");

-- Auto-update trigger
CREATE OR REPLACE FUNCTION regimen_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('norwegian', coalesce(NEW."name", '')), 'A') ||
    setweight(to_tsvector('simple',    coalesce(array_to_string(NEW."genericNames", ' '), '')), 'B') ||
    setweight(to_tsvector('simple',    coalesce(array_to_string(NEW."brandNames", ' '), '')), 'B') ||
    setweight(to_tsvector('simple',    coalesce(array_to_string(NEW."synonyms", ' '), '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS regimen_search_vector_trigger ON "Regimen";
CREATE TRIGGER regimen_search_vector_trigger
  BEFORE INSERT OR UPDATE ON "Regimen"
  FOR EACH ROW EXECUTE FUNCTION regimen_search_vector_update();
