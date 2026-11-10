-- Full-text search: keep "Regimen"."searchVector" (column + GIN index created in init) in sync via trigger.
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

-- Backfill rows that existed before the trigger.
UPDATE "Regimen" SET "name" = "name";
