package com.akshara.school.util;

public final class TextUtils {

    private TextUtils() {
    }

    /** Trims the text, and returns null when nothing is left. */
    public static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}