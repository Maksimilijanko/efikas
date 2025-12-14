package org.unibl.etf.efikas.exceptions;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle @Validated on method parameters
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = error instanceof FieldError ?
                    ((FieldError) error).getField() :
                    error.getObjectName();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Validation Failed");
        response.put("errors", errors);
        response.put("message", "Validation error. Check 'errors' field for details");

        return ResponseEntity.badRequest().body(response);
    }

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

    @ExceptionHandler(InvalidBookPeriodException.class)
    public ResponseEntity<?> handleBookDatePeriodException(InvalidBookPeriodException ex){
        return ResponseEntity.badRequest().body(ex.getMessage());
    }


}
