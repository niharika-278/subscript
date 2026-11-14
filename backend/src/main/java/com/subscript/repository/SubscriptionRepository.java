package com.subscript.repository;

import com.subscript.model.Subscription;
import com.subscript.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Spring Data JPA generates the SQL for these methods from their names
 * (e.g. findByStatus becomes SELECT ... WHERE status = ?).
 */
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByStatus(SubscriptionStatus status);
}
