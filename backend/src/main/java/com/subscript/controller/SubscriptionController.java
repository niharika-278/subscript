package com.subscript.controller;

import com.subscript.dto.StatusUpdateRequest;
import com.subscript.dto.SubscriptionRequest;
import com.subscript.dto.SubscriptionResponse;
import com.subscript.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** REST endpoints for subscription CRUD and status changes. */
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService service;

    public SubscriptionController(SubscriptionService service) {
        this.service = service;
    }

    /**
     * List subscriptions with optional search, filters and sorting.
     * Example: /api/subscriptions?search=net&category=MUSIC&status=ACTIVE&sort=amount&direction=desc
     */
    @GetMapping
    public List<SubscriptionResponse> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "nextRenewalDate") String sort,
            @RequestParam(required = false, defaultValue = "asc") String direction) {
        return service.list(search, category, status, sort, direction);
    }

    @GetMapping("/{id}")
    public SubscriptionResponse get(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<SubscriptionResponse> create(@Valid @RequestBody SubscriptionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public SubscriptionResponse update(@PathVariable Long id,
                                       @Valid @RequestBody SubscriptionRequest request) {
        return service.update(id, request);
    }

    /** Pause / reactivate / cancel: body is { "status": "PAUSED" } etc. */
    @PutMapping("/{id}/status")
    public SubscriptionResponse updateStatus(@PathVariable Long id,
                                             @Valid @RequestBody StatusUpdateRequest request) {
        return service.updateStatus(id, request.status());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
