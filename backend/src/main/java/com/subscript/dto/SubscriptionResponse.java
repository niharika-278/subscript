package com.subscript.dto;

import com.subscript.model.BillingFrequency;
import com.subscript.model.Category;
import com.subscript.model.Subscription;
import com.subscript.model.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Outgoing representation of a subscription. Also carries the monthly
 * equivalent so the frontend never has to repeat the normalization math.
 */
public record SubscriptionResponse(
        Long id,
        String name,
        Category category,
        BigDecimal amount,
        String currency,
        BillingFrequency billingFrequency,
        LocalDate startDate,
        LocalDate nextRenewalDate,
        String paymentMethod,
        SubscriptionStatus status,
        int reminderDays,
        String notes,
        BigDecimal monthlyEquivalent,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static SubscriptionResponse from(Subscription s) {
        return new SubscriptionResponse(
                s.getId(),
                s.getName(),
                s.getCategory(),
                s.getAmount(),
                s.getCurrency(),
                s.getBillingFrequency(),
                s.getStartDate(),
                s.getNextRenewalDate(),
                s.getPaymentMethod(),
                s.getStatus(),
                s.getReminderDays(),
                s.getNotes(),
                s.getBillingFrequency().toMonthlyAmount(s.getAmount()),
                s.getCreatedAt(),
                s.getUpdatedAt()
        );
    }
}
