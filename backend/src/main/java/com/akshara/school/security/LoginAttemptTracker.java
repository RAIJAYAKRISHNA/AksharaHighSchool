package com.akshara.school.security;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

@Component
public class LoginAttemptTracker {

    private static final int MAX_FAILURES = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);
    private static final int PURGE_THRESHOLD = 5000;

    private record Attempts(int failures, Instant firstFailureAt) {

        boolean isExpired() {
            return firstFailureAt.plus(WINDOW).isBefore(Instant.now());
        }
    }

    private final ConcurrentHashMap<String, Attempts> attempts = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        Attempts current = attempts.get(key);

        if (current == null) {
            return false;
        }

        if (current.isExpired()) {
            attempts.remove(key);
            return false;
        }

        return current.failures() >= MAX_FAILURES;
    }

    public void recordFailure(String key) {
        if (attempts.size() > PURGE_THRESHOLD) {
            attempts.entrySet().removeIf(entry -> entry.getValue().isExpired());
        }

        attempts.merge(
                key,
                new Attempts(1, Instant.now()),
                (old, fresh) -> old.isExpired()
                        ? fresh
                        : new Attempts(old.failures() + 1, old.firstFailureAt()));
    }

    public void reset(String key) {
        attempts.remove(key);
    }
}