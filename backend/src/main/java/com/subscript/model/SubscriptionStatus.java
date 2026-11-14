package com.subscript.model;

/**
 * Lifecycle state of a subscription.
 * Only ACTIVE subscriptions count towards projected spending and reminders.
 */
public enum SubscriptionStatus {
    ACTIVE, PAUSED, CANCELLED
}
