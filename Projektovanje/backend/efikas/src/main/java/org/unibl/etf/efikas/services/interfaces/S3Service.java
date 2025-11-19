package org.unibl.etf.efikas.services.interfaces;

import org.springframework.web.multipart.MultipartFile;
import org.unibl.etf.efikas.models.responses.FileUploadResponse;

import java.io.IOException;

public interface S3Service {
    /**
     * Uploads a file to a S3 bucket.
     * @param file The {@code MultipartFile} object to be saved to the S3 bucket.
     * */
    FileUploadResponse uploadFile(MultipartFile file) throws IOException;

    /**
     * Downloads a file from the S3 bucket.
     * @param key The key identifier to the object on the S3 bucket.
     * */
    byte[] downloadFile(String key) throws IOException;

    /**
     * Gets a presigned URL of an object in the S3 bucket.
     * @param key The key identifier to the object on the S3 bucket.
     * */
    String getPresignedUrl(String key);
}
