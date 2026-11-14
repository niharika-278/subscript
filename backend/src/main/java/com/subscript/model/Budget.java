package com.subscript.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * The single monthly budget record. The table always holds exactly one
 * row with id = 1; BudgetService creates it on first use.
 */
@Entity
@Table(name = "budget")
public class Budget {

    public static final int SINGLE_ROW_ID = 1;

    @Id
    private Integer id;

    @Column(name = "monthly_limit", nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyLimit;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Budget() {
    }

    public Budget(Integer id, BigDecimal monthlyLimit) {
        this.id = id;
        this.monthlyLimit = monthlyLimit;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getId() { return id; }
    public BigDecimal getMonthlyLimit() { return monthlyLimit; }
    public void setMonthlyLimit(BigDecimal monthlyLimit) { this.monthlyLimit = monthlyLimit; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
