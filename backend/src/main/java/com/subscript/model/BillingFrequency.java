package com.subscript.model;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Billing cycle of a subscription. Knows how to normalize an amount
 * into a monthly and an annual equivalent, which is the core of all
 * spending calculations in Subscript.
 */
public enum BillingFrequency {

    WEEKLY, MONTHLY, QUARTERLY, YEARLY;

    private static final BigDecimal WEEKS_PER_YEAR = new BigDecimal("52");
    private static final BigDecimal MONTHS_PER_YEAR = new BigDecimal("12");
    private static final BigDecimal QUARTERS_PER_YEAR = new BigDecimal("4");

    /** Monthly equivalent, e.g. a yearly plan's amount / 12. Rounded to 2 decimals. */
    public BigDecimal toMonthlyAmount(BigDecimal amount) {
        return switch (this) {
            case WEEKLY -> divide(amount.multiply(WEEKS_PER_YEAR), MONTHS_PER_YEAR);
            case MONTHLY -> amount.setScale(2, RoundingMode.HALF_UP);
            case QUARTERLY -> divide(amount, new BigDecimal("3"));
            case YEARLY -> divide(amount, MONTHS_PER_YEAR);
        };
    }

    /** Annual equivalent, e.g. a weekly plan's amount * 52. Rounded to 2 decimals. */
    public BigDecimal toAnnualAmount(BigDecimal amount) {
        return switch (this) {
            case WEEKLY -> amount.multiply(WEEKS_PER_YEAR).setScale(2, RoundingMode.HALF_UP);
            case MONTHLY -> amount.multiply(MONTHS_PER_YEAR).setScale(2, RoundingMode.HALF_UP);
            case QUARTERLY -> amount.multiply(QUARTERS_PER_YEAR).setScale(2, RoundingMode.HALF_UP);
            case YEARLY -> amount.setScale(2, RoundingMode.HALF_UP);
        };
    }

    private static BigDecimal divide(BigDecimal amount, BigDecimal divisor) {
        return amount.divide(divisor, 2, RoundingMode.HALF_UP);
    }
}
