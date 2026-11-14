-- ============================================================
-- Subscript - database schema
-- Execute this file ONCE in MySQL Workbench or the MySQL CLI.
-- It creates the database, two tables, constraints and indexes.
-- ============================================================

CREATE DATABASE IF NOT EXISTS subscript_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE subscript_db;

-- ------------------------------------------------------------
-- subscriptions: one row per subscription the user tracks.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
    id                 BIGINT        NOT NULL AUTO_INCREMENT,
    name               VARCHAR(100)  NOT NULL,
    category           VARCHAR(50)   NOT NULL,
    amount             DECIMAL(10,2) NOT NULL,
    currency           VARCHAR(8)    NOT NULL DEFAULT 'INR',
    billing_frequency  VARCHAR(20)   NOT NULL,
    start_date         DATE          NOT NULL,
    next_renewal_date  DATE          NOT NULL,
    payment_method     VARCHAR(50)   NULL,
    status             VARCHAR(20)   NOT NULL DEFAULT 'ACTIVE',
    reminder_days      INT           NOT NULL DEFAULT 3,
    notes              VARCHAR(500)  NULL,
    created_at         DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at         DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),

    CONSTRAINT chk_subscriptions_category
        CHECK (category IN ('ENTERTAINMENT','MUSIC','EDUCATION','PRODUCTIVITY',
                            'LIFESTYLE','FITNESS','GAMING','CLOUD_STORAGE','OTHER')),
    CONSTRAINT chk_subscriptions_frequency
        CHECK (billing_frequency IN ('WEEKLY','MONTHLY','QUARTERLY','YEARLY')),
    CONSTRAINT chk_subscriptions_status
        CHECK (status IN ('ACTIVE','PAUSED','CANCELLED')),
    CONSTRAINT chk_subscriptions_amount
        CHECK (amount >= 0),
    CONSTRAINT chk_subscriptions_reminder_days
        CHECK (reminder_days BETWEEN 1 AND 30)
);

-- Speeds up the dashboard's "active subscriptions" lookups
CREATE INDEX idx_subscriptions_status
    ON subscriptions (status);

-- Speeds up renewal-calendar and reminder date ranges
CREATE INDEX idx_subscriptions_next_renewal
    ON subscriptions (next_renewal_date);

-- Speeds up category filter / category breakdown grouping
CREATE INDEX idx_subscriptions_category
    ON subscriptions (category);

-- ------------------------------------------------------------
-- budget: exactly one row (id = 1) holding the monthly limit.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS budget (
    id            INT           NOT NULL,
    monthly_limit DECIMAL(10,2) NOT NULL,
    updated_at    DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),

    CONSTRAINT chk_budget_limit
        CHECK (monthly_limit >= 0)
);

-- Seed the single budget row so the application always finds one.
INSERT INTO budget (id, monthly_limit)
VALUES (1, 0.00)
ON DUPLICATE KEY UPDATE id = id;
