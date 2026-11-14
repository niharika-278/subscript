package com.subscript.model;

/**
 * Predefined subscription categories. Stored as their name in the
 * subscriptions table (e.g. "CLOUD_STORAGE"); the frontend maps each
 * name to a label, icon and colour.
 */
public enum Category {
    ENTERTAINMENT, MUSIC, EDUCATION, PRODUCTIVITY, LIFESTYLE,
    FITNESS, GAMING, CLOUD_STORAGE, OTHER
}
