package org.unibl.etf.efikas.exceptions;

public class InvalidBookPeriodException extends RuntimeException {

    public InvalidBookPeriodException() { super("Wrong requested date format for book."); }

    public InvalidBookPeriodException(String message) { super(message); }
}
