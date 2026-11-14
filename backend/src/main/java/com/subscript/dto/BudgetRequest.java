package com.subscript.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/** Body of PUT /api/budget. */
public record BudgetRequest(
        @NotNull(message = "Monthly budget is required")
        @DecimalMin(value = "0.01", message = "Monthly budget must be greater than 0")
        @Digits(integer = 8, fraction = 2, message = "Monthly budget must be a valid amount")
        BigDecimal monthlyLimit
) {
}
