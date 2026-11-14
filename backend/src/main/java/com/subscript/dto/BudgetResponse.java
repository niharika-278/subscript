package com.subscript.dto;

import com.subscript.model.Category;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Full budget picture: the stored limit plus everything computed from
 * the user's active subscriptions. categoryBreakdown feeds the
 * category-wise bars on the Budget page.
 */
public record BudgetResponse(
        Integer id,
        BigDecimal monthlyLimit,
        LocalDateTime updatedAt,
        BigDecimal monthlySpend,
        BigDecimal remaining,
        BigDecimal utilizationPercent,
        String state,
        List<CategoryShare> categoryBreakdown
) {
    /** Monthly-equivalent spending of one category, and its share of the total. */
    public record CategoryShare(
            Category category,
            long count,
            BigDecimal monthlyAmount,
            BigDecimal percentage
    ) {
    }
}
