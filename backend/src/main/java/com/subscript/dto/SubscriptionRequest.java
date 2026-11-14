package com.subscript.dto;

import com.subscript.model.BillingFrequency;
import com.subscript.model.Category;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Incoming payload for creating or editing a subscription.
 * Status is not part of the request: new subscriptions start as ACTIVE
 * and status changes go through PUT /api/subscriptions/{id}/status.
 */
public record SubscriptionRequest(
        @NotBlank(message = "Service name is required")
        @Size(max = 100, message = "Service name must be at most 100 characters")
        String name,

        @NotNull(message = "Category is required")
        Category category,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        BigDecimal amount,

        @NotNull(message = "Billing frequency is required")
        BillingFrequency billingFrequency,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "Next renewal date is required")
        LocalDate nextRenewalDate,

        @Size(max = 50, message = "Payment method must be at most 50 characters")
        String paymentMethod,

        @NotNull(message = "Reminder preference is required")
        @Min(value = 1, message = "Reminder must be at least 1 day before renewal")
        @Max(value = 30, message = "Reminder must be at most 30 days before renewal")
        Integer reminderDays,

        @Size(max = 500, message = "Notes must be at most 500 characters")
        String notes
) {
}
