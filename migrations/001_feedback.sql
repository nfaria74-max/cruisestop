-- CruiseStop - feedback ratings
-- One row per purchase. session_id is the natural key.
-- Apply with:
--   npx wrangler d1 execute cruisestop-access --remote --file=migrations/001_feedback.sql

CREATE TABLE IF NOT EXISTS feedback (
  session_id   TEXT    PRIMARY KEY
               REFERENCES purchases(session_id) ON DELETE CASCADE,
  route        TEXT    NOT NULL,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  language     TEXT,
  device_token TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at   INTEGER
);

CREATE INDEX IF NOT EXISTS idx_feedback_route ON feedback(route);
