package org.unibl.etf.efikas.services.impl;


import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.efikas.configs.properties.TwilioProperties;
import org.unibl.etf.efikas.services.interfaces.OtpService;

@Service
@AllArgsConstructor
public class TwilioOtpService implements OtpService {
    private final TwilioProperties twilioProperties;

    @PostConstruct
    public void init() {
        Twilio.init(twilioProperties.getAccountSid(), twilioProperties.getAuthToken());
    }

    @Override
    public String sendOtp(String toPhoneNumber, String smsMessage) throws ApiException {
        Verification verification = Verification.creator(
                twilioProperties.getVerifySid(),
                toPhoneNumber,
                "sms").create();

        return verification.getStatus();
    }

    @Override
    public boolean verifyOtp(String phoneNumber, String code) {
        VerificationCheck check = VerificationCheck.creator(twilioProperties.getVerifySid())
                .setTo(phoneNumber)
                .setCode(code)
                .create();

        return "approved".equals(check.getStatus());
    }
}
