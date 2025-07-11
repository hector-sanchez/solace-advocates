-- Migration: Add search performance indexes
-- Created manually for search optimization

-- Full-text search index for combined text fields
CREATE INDEX idx_advocates_search ON advocates USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || city || ' ' || degree));

-- Individual field indexes for common search patterns
CREATE INDEX idx_advocates_first_name ON advocates (first_name);
CREATE INDEX idx_advocates_last_name ON advocates (last_name);
CREATE INDEX idx_advocates_city ON advocates (city);

-- JSONB index for specialties array search
CREATE INDEX idx_advocates_specialties ON advocates USING gin(payload);
