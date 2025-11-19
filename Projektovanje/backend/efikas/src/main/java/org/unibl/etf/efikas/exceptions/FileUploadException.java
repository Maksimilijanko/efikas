package org.unibl.etf.efikas.exceptions;

public class FileUploadException extends RuntimeException {
    public FileUploadException() {
        super("A file couldn't be uploaded.");
    }

    public FileUploadException(String message) {
        super(message);
    }
}
