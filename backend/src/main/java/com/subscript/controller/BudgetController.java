package com.subscript.controller;

import com.subscript.dto.BudgetRequest;
import com.subscript.dto.BudgetResponse;
import com.subscript.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** REST endpoints for the monthly budget and its computed status. */
@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    private final BudgetService service;

    public BudgetController(BudgetService service) {
        this.service = service;
    }

    @GetMapping
    public BudgetResponse getBudget() {
        return service.getBudgetStatus();
    }

    @PutMapping
    public BudgetResponse updateBudget(@Valid @RequestBody BudgetRequest request) {
        return service.updateBudget(request);
    }
}
