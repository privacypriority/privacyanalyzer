-- Privacy Analysis Database Schema
-- Cloudflare D1 Migration - Version 1

-- Analyses table - stores privacy policy analysis results
CREATE TABLE IF NOT EXISTS analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    domain TEXT NOT NULL,
    hostname TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    overall_score REAL NOT NULL,
    privacy_grade TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    dpdp_act_compliance TEXT,
    analysis_data TEXT NOT NULL,
    homepage_screenshot TEXT,
    scraper_used TEXT,
    content_length INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(domain, content_hash)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_domain ON analyses(domain);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_last_checked ON analyses(last_checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_content_hash ON analyses(content_hash);
CREATE INDEX IF NOT EXISTS idx_analyses_domain_checked ON analyses(domain, last_checked_at DESC);

-- Analysis statistics table
CREATE TABLE IF NOT EXISTS analysis_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_analyses INTEGER DEFAULT 0,
    unique_domains INTEGER DEFAULT 0,
    avg_score REAL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Grade distribution tracking
CREATE TABLE IF NOT EXISTS grade_distribution (
    grade TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
);

-- Risk level distribution tracking
CREATE TABLE IF NOT EXISTS risk_distribution (
    risk_level TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0
);

-- Initialize stats table with default row
INSERT INTO analysis_stats (id, total_analyses, unique_domains, avg_score)
SELECT 1, 0, 0, 0.0
WHERE NOT EXISTS (SELECT 1 FROM analysis_stats WHERE id = 1);

-- Initialize grade distribution
INSERT OR IGNORE INTO grade_distribution (grade, count) VALUES
('A+', 0), ('A', 0), ('A-', 0),
('B+', 0), ('B', 0), ('B-', 0),
('C+', 0), ('C', 0), ('C-', 0),
('D+', 0), ('D', 0), ('D-', 0),
('F', 0);

-- Initialize risk distribution
INSERT OR IGNORE INTO risk_distribution (risk_level, count) VALUES
('EXEMPLARY', 0),
('LOW', 0),
('MODERATE', 0),
('MODERATE-HIGH', 0),
('HIGH', 0);
