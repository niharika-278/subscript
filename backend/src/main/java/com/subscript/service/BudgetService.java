package com.subscript.service;

import com.subscript.dto.BudgetRequest;
import com.subscript.dto.BudgetResponse;
import com.subscript.model.Budget;
import com.subscript.model.Category;
import com.subscript.model.Subscription;
import com.subscript.model.SubscriptionStatus;
import com.subscript.repository.BudgetRepository;
import com.subscript.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.List;

/**
 * Owns the single monthly budget row and every budget calculation:
 * utilization percentage, remaining amount, status thresholds and the
 * category-wise split of the monthly recurring spend.
 */
@Service
public class BudgetService {

    /** Simple thresholds, kept as constants on purpose (see Product spec). */
    private static final BigDecimal COMFORTABLE_BELOW = new BigDecimal("75");
    private static final BigDecimal OVER_ABOVE = new BigDecimal("100");

    private static final BigDecimal HUNDRED = new BigDecimal("100");

    private final BudgetRepository budgetRepository;
    private final SubscriptionRepository subscriptionRepository;

    public BudgetService(BudgetRepository budgetRepository, SubscriptionRepository subscriptionRepository) {
        this.budgetRepository = budgetRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    @Transactional
    public BudgetResponse updateBudget(BudgetRequest request) {
        Budget budget = getOrCreateBudget();
        budget.setMonthlyLimit(request.monthlyLimit().setScale(2, RoundingMode.HALF_UP));
        budgetRepository.save(budget);
        return getBudgetStatus();
    }

    @Transactional
    public BudgetResponse getBudgetStatus() {
        Budget budget = getOrCreateBudget();
        List<Subscription> active = subscriptionRepository.findByStatus(SubscriptionStatus.ACTIVE);

        BigDecimal monthlySpend = totalMonthly(active);
        BigDecimal remaining = budget.getMonthlyLimit().subtract(monthlySpend).setScale(2, RoundingMode.HALF_UP);
        BigDecimal utilization = utilizationPercent(monthlySpend, budget.getMonthlyLimit());

        return new BudgetResponse(
                budget.getId(),
                budget.getMonthlyLimit(),
                budget.getUpdatedAt(),
                monthlySpend,
                remaining,
                utilization,
                resolveState(budget.getMonthlyLimit(), utilization),
                categoryBreakdown(active, monthlySpend)
        );
    }

    /** The budget table holds exactly one row (id = 1); created on first use. */
    private Budget getOrCreateBudget() {
        return budgetRepository.findById(Budget.SINGLE_ROW_ID)
                .orElseGet(() -> budgetRepository.save(new Budget(Budget.SINGLE_ROW_ID, BigDecimal.ZERO)));
    }

    /** Sum of the monthly equivalents of all active subscriptions. */
    private BigDecimal totalMonthly(List<Subscription> active) {
        return active.stream()
                .map(s -> s.getBillingFrequency().toMonthlyAmount(s.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }

    /** spend / limit * 100, rounded to 1 decimal. 0 when no budget is set. */
    private BigDecimal utilizationPercent(BigDecimal spend, BigDecimal limit) {
        if (limit.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP);
        }
        return spend.multiply(HUNDRED).divide(limit, 1, RoundingMode.HALF_UP);
    }

    private String resolveState(BigDecimal limit, BigDecimal utilization) {
        if (limit.compareTo(BigDecimal.ZERO) <= 0) return "NO_BUDGET";
        if (utilization.compareTo(COMFORTABLE_BELOW) < 0) return "COMFORTABLE";
        if (utilization.compareTo(OVER_ABOVE) <= 0) return "APPROACHING";
        return "OVER_BUDGET";
    }

    /** Monthly-equivalent spend per category, largest category first. */
    private List<BudgetResponse.CategoryShare> categoryBreakdown(List<Subscription> active, BigDecimal total) {
        return active.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        Subscription::getCategory,
                        java.util.stream.Collectors.toList()))
                .entrySet().stream()
                .map(entry -> {
                    List<Subscription> subs = entry.getValue();
                    BigDecimal monthlyAmount = subs.stream()
                            .map(s -> s.getBillingFrequency().toMonthlyAmount(s.getAmount()))
                            .reduce(BigDecimal.ZERO, BigDecimal::add)
                            .setScale(2, RoundingMode.HALF_UP);
                    return new BudgetResponse.CategoryShare(
                            entry.getKey(),
                            subs.size(),
                            monthlyAmount,
                            percentOf(monthlyAmount, total));
                })
                .sorted(Comparator.comparing(BudgetResponse.CategoryShare::monthlyAmount).reversed())
                .toList();
    }

    private BigDecimal percentOf(BigDecimal part, BigDecimal total) {
        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO.setScale(1, RoundingMode.HALF_UP);
        }
        return part.multiply(HUNDRED).divide(total, 1, RoundingMode.HALF_UP);
    }
}
