package com.subscript.dto;

import com.subscript.model.SubscriptionStatus;
import jakarta.validation.constraints.NotNull;

/** Body of PUT /api/subscriptions/{id}/status (pause, reactivate, cancel). */
public record StatusUpdateRequest(
        @NotNull(message = "Status is required")
        SubscriptionStatus status
) {
}
