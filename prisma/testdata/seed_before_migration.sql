-- Seed test data before running the latest migration
-- This file should insert test data to verify migration data integrity

-- Insert test users (only publicID is stored, nickname/email come from IDP)
INSERT INTO "users" (public_id, created_at, updated_at)
VALUES
  ('test-user-1', NOW(), NOW()),
  ('test-user-2', NOW(), NOW()),
  ('test-user-3', NOW(), NOW());

-- Insert test saju records to verify user_id -> user_public_id migration
INSERT INTO "saju_records" (public_id, data, type, version, user_id, created_at)
VALUES
  (
    'test-saju-1',
    '{"name": "Test User 1", "health": "Good health", "wealth": "Good fortune", "romantic": "Love is coming", "relationship": "Good relationships", "caution": "Be careful", "gender": "MALE", "birthDateTime": "1990-01-01T00:00:00Z", "fortuneScore": 85, "todayShortMessage": "Today will be good", "totalFortuneMessage": "Overall good fortune", "questionAnswer": null}'::jsonb,
    'DAILY_NORMAL',
    1.0,
    (SELECT id FROM users WHERE public_id = 'test-user-1'),
    NOW()
  ),
  (
    'test-saju-2',
    '{"name": "Test User 2", "health": "Average health", "wealth": "Stable fortune", "romantic": "Take time", "relationship": "Maintain current relationships", "caution": "Stay focused", "gender": "FEMALE", "birthDateTime": "1995-05-15T00:00:00Z", "fortuneScore": 70, "todayShortMessage": "A calm day", "totalFortuneMessage": "Stable fortune", "questionAnswer": null}'::jsonb,
    'DAILY_NORMAL',
    1.0,
    (SELECT id FROM users WHERE public_id = 'test-user-2'),
    NOW()
  ),
  (
    'test-saju-3',
    '{"name": "Test User 1", "birthDateTime": "1990-01-01T00:00:00Z", "gender": "MALE", "chart": {"earthly": {"branches": {"year": "子", "month": "丑", "day": "寅", "hour": "卯"}, "fiveElements": {"year": "水", "month": "土", "day": "木", "hour": "木"}}, "heavenly": {"stems": {"year": "庚", "month": "己", "day": "甲", "hour": "乙"}, "fiveElements": {"year": "金", "month": "土", "day": "木", "hour": "木"}}}, "description": {"general": "General description", "relationship": "Relationship fortune", "wealth": "Wealth fortune", "romantic": "Love fortune", "health": "Health fortune", "career": "Career fortune", "waysToImprove": "Ways to improve", "caution": "Be cautious", "questionAnswer": null}}'::jsonb,
    'NEW_YEAR',
    1.0,
    (SELECT id FROM users WHERE public_id = 'test-user-1'),
    NOW()
  );
