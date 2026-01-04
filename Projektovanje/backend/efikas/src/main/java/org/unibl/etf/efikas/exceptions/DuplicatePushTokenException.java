package org.unibl.etf.efikas.exceptions;

public class DuplicatePushTokenException extends RuntimeException {
    public DuplicatePushTokenException() { super("This push token already exists."); }

    public DuplicatePushTokenException(String message) {
        super(message);
    }
}
