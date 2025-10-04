-- Seed test data before running the latest migration
-- This file should insert test data to verify migration data integrity

-- Insert test users (only publicID is stored, nickname/email come from IDP)
INSERT INTO "users" (public_id, created_at, updated_at)
VALUES
  ('test-user-1', NOW(), NOW()),
  ('test-user-2', NOW(), NOW()),
  ('test-user-3', NOW(), NOW());
