package org.unibl.etf.efikas.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(S3UploadException.class)
    public ResponseEntity<?> handleS3UploadException(S3UploadException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(S3DeletionException.class)
    public ResponseEntity<?> handleS3DeletionException(S3DeletionException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }

    @ExceptionHandler(BookPdfGenerationException.class)
    public ResponseEntity<?> handleS3DeletionException(BookPdfGenerationException ex){
        return ResponseEntity.internalServerError().body(ex.getMessage());
    }
}
