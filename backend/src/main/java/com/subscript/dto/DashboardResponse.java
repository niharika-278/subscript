package com.subscript.dto;

import com.subscript.model.BillingFrequency;
import com.subscript.model.Category;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Everything the dashboard (and analytics page) needs in one response,
 * computed from live subscription rows. No statistics are stored.
 */
public record DashboardResponse(
        long totalActiveSubscriptions,
        BigDecimal monthlySpend,
        BigDecimal annualSpend,
        long upcomingRenewalsCount,
        BigDecimal averageMonthlyCost,
        BudgetResponse budgetStatus,
        List<BudgetResponse.CategoryShare> categoryBreakdown,
        List<FrequencyShare> frequencyBreakdown,
        List<UpcomingRenewal> upcomingRenewals,
        List<ReminderItem> reminders
) {
    /** One bar of the "Subscription Distribution" chart. */
    public record FrequencyShare(
            BillingFrequency frequency,
            long count,
            BigDecimal monthlyAmount
    ) {
    }

    /** A renewal happening within the next 30 days. */
    public record UpcomingRenewal(
            Long id,
            String name,
            Category category,
            BigDecimal amount,
            BillingFrequency billingFrequency,
            LocalDate nextRenewalDate,
            long daysUntil
    ) {
    }

    /**
     * A reminder derived purely from dates at read time:
     * daysUntil < 0 -> OVERDUE, == 0 -> DUE_TODAY, else UPCOMING.
     * Nothing is persisted, so reminders can never duplicate.
     */
    public record ReminderItem(
            Long id,
            String name,
            Category category,
            BigDecimal amount,
            LocalDate nextRenewalDate,
            long daysUntil,
            int reminderDays,
            String state
    ) {
    }
}
