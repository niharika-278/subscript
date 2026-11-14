-- ============================================================
-- Subscript - OPTIONAL sample data
--
-- Run schema.sql first, then this file if you want demo data.
-- All dates are relative to the day you run it (CURDATE()),
-- so reminders and the renewal calendar always look alive:
-- one renewal is today, one is overdue, several are upcoming.
-- To start with an empty app, simply skip this file.
-- ============================================================

USE subscript_db;

INSERT INTO subscriptions
    (name, category, amount, currency, billing_frequency, start_date,
     next_renewal_date, payment_method, status, reminder_days, notes)
VALUES
    -- Renewal 2 days out (within the 3-day reminder window)
    ('Netflix', 'ENTERTAINMENT', 649.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 400 DAY), DATE_ADD(CURDATE(), INTERVAL 2 DAY),
     'UPI', 'ACTIVE', 3, 'Family plan - shared with Aditi and Rohan'),

    -- Due today (reminder window 1 day)
    ('YouTube Premium', 'ENTERTAINMENT', 149.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 220 DAY), CURDATE(),
     'UPI', 'ACTIVE', 1, 'Ad-free videos and YouTube Music'),

    -- Renewal tomorrow
    ('Xbox Game Pass Ultimate', 'GAMING', 549.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 150 DAY), DATE_ADD(CURDATE(), INTERVAL 1 DAY),
     'Credit Card', 'ACTIVE', 3, 'Cancelled once the library got repetitive'),

    -- Renewal 9 days out
    ('Spotify Premium', 'MUSIC', 119.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 520 DAY), DATE_ADD(CURDATE(), INTERVAL 9 DAY),
     'Credit Card', 'ACTIVE', 3, 'Student discount applied'),

    -- Overdue by 4 days (still ACTIVE -> shows the Overdue reminder state)
    ('Google One 200GB', 'CLOUD_STORAGE', 130.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 300 DAY), DATE_SUB(CURDATE(), INTERVAL 4 DAY),
     'UPI', 'ACTIVE', 3, 'Backs up phone photos automatically'),

    -- Yearly plan renewing in 22 days
    ('Disney+ Hotstar', 'ENTERTAINMENT', 1499.00, 'INR', 'YEARLY',
     DATE_SUB(CURDATE(), INTERVAL 343 DAY), DATE_ADD(CURDATE(), INTERVAL 22 DAY),
     'Credit Card', 'ACTIVE', 7, 'IPL season only, honestly'),

    -- Quarterly plan renewing in 40 days
    ('Coursera Plus', 'EDUCATION', 3999.00, 'INR', 'QUARTERLY',
     DATE_SUB(CURDATE(), INTERVAL 80 DAY), DATE_ADD(CURDATE(), INTERVAL 40 DAY),
     'Credit Card', 'ACTIVE', 7, 'Worth it only during certification sprints'),

    -- Quarterly plan renewing in 5 days
    ('cultpass Elite', 'FITNESS', 5999.00, 'INR', 'QUARTERLY',
     DATE_SUB(CURDATE(), INTERVAL 85 DAY), DATE_ADD(CURDATE(), INTERVAL 5 DAY),
     'UPI', 'ACTIVE', 7, 'Gym + at-home workouts'),

    -- Weekly plan (monthly equivalent = 90 * 52 / 12 = 390)
    ('Newspaper Delivery', 'LIFESTYLE', 90.00, 'INR', 'WEEKLY',
     DATE_SUB(CURDATE(), INTERVAL 120 DAY), DATE_ADD(CURDATE(), INTERVAL 4 DAY),
     'Cash', 'ACTIVE', 3, 'Weekend edition, paid to the paper boy'),

    -- Yearly plan renewing in 80 days
    ('Canva Pro', 'PRODUCTIVITY', 3999.00, 'INR', 'YEARLY',
     DATE_SUB(CURDATE(), INTERVAL 285 DAY), DATE_ADD(CURDATE(), INTERVAL 80 DAY),
     'Credit Card', 'ACTIVE', 7, NULL),

    -- Monthly plan renewing in 14 days
    ('iCloud+ 50GB', 'CLOUD_STORAGE', 75.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 200 DAY), DATE_ADD(CURDATE(), INTERVAL 14 DAY),
     'UPI', 'ACTIVE', 3, NULL),

    -- Paused subscriptions (excluded from spending and reminders)
    ('Audible', 'LIFESTYLE', 199.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 310 DAY), DATE_ADD(CURDATE(), INTERVAL 11 DAY),
     'Credit Card', 'PAUSED', 3, 'Paused until exams are over'),

    ('Notion Plus', 'PRODUCTIVITY', 830.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 95 DAY), DATE_ADD(CURDATE(), INTERVAL 3 DAY),
     'Credit Card', 'PAUSED', 3, 'Free plan is enough for now'),

    -- Cancelled (excluded from every calculation)
    ('Adobe Creative Cloud', 'PRODUCTIVITY', 1675.00, 'INR', 'MONTHLY',
     DATE_SUB(CURDATE(), INTERVAL 500 DAY), DATE_ADD(CURDATE(), INTERVAL 6 DAY),
     'Credit Card', 'CANCELLED', 3, 'Switched to Canva Pro - much cheaper');

-- A monthly budget that the sample data puts near 97% utilisation,
-- so the budget progress bar shows the "approaching limit" state.
UPDATE budget SET monthly_limit = 6000.00 WHERE id = 1;
