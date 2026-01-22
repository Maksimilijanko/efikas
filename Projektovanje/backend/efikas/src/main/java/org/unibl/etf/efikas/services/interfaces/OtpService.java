package org.unibl.etf.efikas.services.interfaces;

public interface OtpService {
    String sendOtp(String to);
    boolean verifyOtp(String to, String code);
    void deleteOtpFromStorage(String key);
}
