package com.subscript.service;

import com.subscript.dto.BudgetResponse;
import com.subscript.dto.DashboardResponse;
import com.subscript.model.BillingFrequency;
import com.subscript.model.Subscription;
import com.subscript.model.SubscriptionStatus;
import com.subscript.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.AbstractMap;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Computes all dashboard statistics from live subscription rows on
 * every request. Nothing is stored or cached, so stats are always in
 * sync with the data and empty databases are handled naturally.
 */
@Service
public class DashboardService {

    /** How far ahead the "Upcoming renewals" section looks. */
    private static final int UPCOMING_WINDOW_DAYS = 30;
    private static final int UPCOMING_LIST_SIZE = 5;

    /** Reminder states (derived from dates, never persisted). */
    public static final String REMINDER_OVERDUE = "OVERDUE";
    public static final String REMINDER_DUE_TODAY = "DUE_TODAY";
    public static final String REMINDER_UPCOMING = "UPCOMING";

    private final SubscriptionRepository subscriptionRepository;
    private final BudgetService budgetService;

    public DashboardService(SubscriptionRepository subscriptionRepository, BudgetService budgetService) {
        this.subscriptionRepository = subscriptionRepository;
        this.budgetService = budgetService;
    }

    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {
        List<Subscription> active = subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE);
        LocalDate today = LocalDate.now();

        BudgetResponse budgetStatus = budgetService.getBudgetStatus();
        BigDecimal monthlySpend = budgetStatus.monthlySpend();
        BigDecimal annualSpend = active.stream()
                .map(s -> s.getBillingFrequency().toAnnualAmount(s.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        List<DashboardResponse.UpcomingRenewal> upcoming = upcomingRenewals(active, today);

        return new DashboardResponse(
                active.size(),
                monthlySpend,
                annualSpend,
                upcoming.size(),
                averageMonthlyCost(active, monthlySpend),
                budgetStatus,
                budgetStatus.categoryBreakdown(),
                frequencyBreakdown(active),
                upcoming.stream().limit(UPCOMING_LIST_SIZE).toList(),
                reminders(active, today)
        );
    }

    /** Active renewals falling within the next 30 days, soonest first. */
    private List<DashboardResponse.UpcomingRenewal> upcomingRenewals(List<Subscription> active, LocalDate today) {
        LocalDate windowEnd = today.plusDays(UPCOMING_WINDOW_DAYS);
        return active.stream()
                .filter(s -> !s.getNextRenewalDate().isBefore(today)
                        && !s.getNextRenewalDate().isAfter(windowEnd))
                .sorted(Comparator.comparing(Subscription::getNextRenewalDate))
                .map(s -> new DashboardResponse.UpcomingRenewal(
                        s.getId(),
                        s.getName(),
                        s.getCategory(),
                        s.getAmount(),
                        s.getBillingFrequency(),
                        s.getNextRenewalDate(),
                        ChronoUnit.DAYS.between(today, s.getNextRenewalDate())))
                .toList();
    }

    /**
     * Reminders derived at read time from today's date and each renewal
     * date - no reminder rows are stored, so nothing can duplicate.
     * Overdue and due-today always appear; upcoming appears only inside
     * the subscription's own reminder window (1 / 3 / 7 days before).
     */
    private List<DashboardResponse.ReminderItem> reminders(List<Subscription> active, LocalDate today) {
        return active.stream()
                .map(s -> {
                    long daysUntil = ChronoUnit.DAYS.between(today, s.getNextRenewalDate());
                    return new AbstractMap.SimpleEntry<>(s, daysUntil);
                })
                .filter(entry -> entry.getValue() < 0 || entry.getValue() <= entry.getKey().getReminderDays())
                .sorted(Map.Entry.comparingByValue())
                .map(entry -> new DashboardResponse.ReminderItem(
                        entry.getKey().getId(),
                        entry.getKey().getName(),
                        entry.getKey().getCategory(),
                        entry.getKey().getAmount(),
                        entry.getKey().getNextRenewalDate(),
                        entry.getValue(),
                        entry.getKey().getReminderDays(),
                        reminderState(entry.getValue())))
                .toList();
    }

    private String reminderState(long daysUntil) {
        if (daysUntil < 0) return REMINDER_OVERDUE;
        if (daysUntil == 0) return REMINDER_DUE_TODAY;
        return REMINDER_UPCOMING;
    }

    /** Count of active subscriptions per billing cycle, in enum order. */
    private List<DashboardResponse.FrequencyShare> frequencyBreakdown(List<Subscription> active) {
        Map<BillingFrequency, List<Subscription>> byFrequency = new EnumMap<>(BillingFrequency.class);
        active.forEach(s -> byFrequency.computeIfAbsent(s.getBillingFrequency(), f -> new java.util.ArrayList<>()).add(s));

        return byFrequency.entrySet().stream()
                .map(entry -> new DashboardResponse.FrequencyShare(
                        entry.getKey(),
                        entry.getValue().size(),
                        entry.getValue().stream()
                                .map(s -> s.getBillingFrequency().toMonthlyAmount(s.getAmount()))
                                .reduce(BigDecimal.ZERO, BigDecimal::add)
                                .setScale(2, RoundingMode.HALF_UP)))
                .toList();
    }

    private BigDecimal averageMonthlyCost(List<Subscription> active, BigDecimal monthlySpend) {
        if (active.isEmpty()) {
            return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        }
        return monthlySpend.divide(new BigDecimal(active.size()), 2, RoundingMode.HALF_UP);
    }
}
