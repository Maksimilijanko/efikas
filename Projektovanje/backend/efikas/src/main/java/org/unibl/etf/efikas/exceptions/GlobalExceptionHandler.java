package org.unibl.etf.efikas.exceptions;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import software.amazon.awssdk.services.ses.model.MessageRejectedException;

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

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<?> handleEntityNotFoundException(EntityNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    // Hvatanje duplikata u bazi podataka (UNIQUE constraint)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<?> handleDataIntegrityViolation(
            DataIntegrityViolationException ex) {

        String userMessage = "Duplicate value violates a unique constraint.";

        // Extracting PostgreSQL error details
        Throwable root = getRootCause(ex);

        if (root instanceof org.postgresql.util.PSQLException psqlEx) {
            if ("23505".equals(psqlEx.getSQLState())) {         // 23505 is a PSQL error code for duplicate attributes "unique_violation"
                userMessage = "A record with the same value already exists.";
            }
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(userMessage);
    }

    @ExceptionHandler(DuplicatePushTokenException.class)
    public  ResponseEntity<?> handleDuplicatePushTokenException(DuplicatePushTokenException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(StoreExistsException.class)
    public  ResponseEntity<?> handleStoreExistsException(StoreExistsException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(MessageRejectedException.class)
    public ResponseEntity<?> handleMessageRejectedException(MessageRejectedException ex){
        return ResponseEntity.badRequest().body("This email is not verified.");
    }

    private Throwable getRootCause(Throwable ex) {
        Throwable cause = ex;
        while (cause.getCause() != null && cause.getCause() != cause) {
            cause = cause.getCause();
        }
        return cause;
    }
}
