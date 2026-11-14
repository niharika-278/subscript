package com.subscript.exception;

/** Thrown when a subscription or budget row does not exist; mapped to HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException subscription(long id) {
        return new ResourceNotFoundException("Subscription with id " + id + " not found");
    }
}
