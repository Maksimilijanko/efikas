package org.unibl.etf.efikas.services.interfaces;

public interface OtpService {
    String sendOtp(String toPhoneNumber, String smsMessage);
    boolean verifyOtp(String toPhoneNumber, String code);
}
