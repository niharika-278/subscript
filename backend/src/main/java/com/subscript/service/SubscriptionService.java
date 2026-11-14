package com.subscript.service;

import com.subscript.dto.SubscriptionRequest;
import com.subscript.dto.SubscriptionResponse;
import com.subscript.exception.ResourceNotFoundException;
import com.subscript.model.Category;
import com.subscript.model.Subscription;
import com.subscript.model.SubscriptionStatus;
import com.subscript.repository.SubscriptionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Business rules for subscriptions: listing with search/filter/sort,
 * create, edit, status changes (pause / reactivate / cancel) and delete.
 */
@Service
public class SubscriptionService {

    private final SubscriptionRepository repository;

    /** Whitelist of sortable columns, so the Sort can never target an unknown property. */
    private static final Map<String, String> SORTABLE_FIELDS = Map.of(
            "nextRenewalDate", "nextRenewalDate",
            "amount", "amount",
            "name", "name"
    );

    private static final Set<String> DIRECTIONS = Set.of("asc", "desc");

    public SubscriptionService(SubscriptionRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> list(String search, String category, String status,
                                           String sort, String direction) {
        Sort sortSpec = Sort.by(resolveDirection(direction), resolveSortField(sort));

        List<Subscription> subscriptions = repository.findAll(sortSpec).stream()
                .filter(s -> matchesCategory(s, category))
                .filter(s -> matchesStatus(s, status))
                .filter(s -> matchesSearch(s, search))
                .toList();

        return subscriptions.stream().map(SubscriptionResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse getById(Long id) {
        return SubscriptionResponse.from(findEntity(id));
    }

    @Transactional
    public SubscriptionResponse create(SubscriptionRequest request) {
        validateDates(request);
        Subscription subscription = new Subscription();
        applyRequest(subscription, request);
        return SubscriptionResponse.from(repository.save(subscription));
    }

    @Transactional
    public SubscriptionResponse update(Long id, SubscriptionRequest request) {
        Subscription subscription = findEntity(id);
        validateDates(request);
        applyRequest(subscription, request);
        return SubscriptionResponse.from(repository.save(subscription));
    }

    @Transactional
    public SubscriptionResponse updateStatus(Long id, SubscriptionStatus newStatus) {
        Subscription subscription = findEntity(id);
        subscription.setStatus(newStatus);
        return SubscriptionResponse.from(repository.save(subscription));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw ResourceNotFoundException.subscription(id);
        }
        repository.deleteById(id);
    }

    private Subscription findEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.subscription(id));
    }

    /** Editable fields only; status is managed through updateStatus. */
    private void applyRequest(Subscription subscription, SubscriptionRequest request) {
        subscription.setName(request.name().trim());
        subscription.setCategory(request.category());
        subscription.setAmount(request.amount());
        subscription.setCurrency("INR");
        subscription.setBillingFrequency(request.billingFrequency());
        subscription.setStartDate(request.startDate());
        subscription.setNextRenewalDate(request.nextRenewalDate());
        subscription.setPaymentMethod(emptyToNull(request.paymentMethod()));
        subscription.setReminderDays(request.reminderDays());
        subscription.setNotes(emptyToNull(request.notes()));
    }

    private void validateDates(SubscriptionRequest request) {
        if (request.nextRenewalDate().isBefore(request.startDate())) {
            throw new IllegalArgumentException("Next renewal date cannot be before the start date");
        }
    }

    private boolean matchesCategory(Subscription s, String category) {
        if (category == null || category.isBlank()) return true;
        return s.getCategory() == parseEnum(Category.class, category, "category");
    }

    private boolean matchesStatus(Subscription s, String status) {
        if (status == null || status.isBlank()) return true;
        return s.getStatus() == parseEnum(SubscriptionStatus.class, status, "status");
    }

    private boolean matchesSearch(Subscription s, String search) {
        if (search == null || search.isBlank()) return true;
        return s.getName().toLowerCase().contains(search.trim().toLowerCase());
    }

    private <T extends Enum<T>> T parseEnum(Class<T> type, String value, String paramName) {
        try {
            return Enum.valueOf(type, value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown " + paramName + ": '" + value + "'");
        }
    }

    private String resolveSortField(String sort) {
        String field = SORTABLE_FIELDS.get(sort);
        if (field == null) {
            throw new IllegalArgumentException("Cannot sort by '" + sort + "'. Allowed: " + SORTABLE_FIELDS.keySet());
        }
        return field;
    }

    private Sort.Direction resolveDirection(String direction) {
        String dir = direction == null ? "asc" : direction.toLowerCase();
        if (!DIRECTIONS.contains(dir)) {
            throw new IllegalArgumentException("Sort direction must be 'asc' or 'desc'");
        }
        return Sort.Direction.fromString(dir);
    }

    private String emptyToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}
