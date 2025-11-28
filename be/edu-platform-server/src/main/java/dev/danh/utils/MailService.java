package dev.danh.utils;

import dev.danh.enums.ErrorCode;
import dev.danh.exception.AppException;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Properties;
@Slf4j
@Service
public class MailService {
    private static final String CONTENT_TYPE_TEXT_HTML = "text/html;charset=\"utf-8\"";

    @Value("${spring.mail.host}")
    private String host;
    @Value("${spring.mail.port}")
    private String port;
    @Value("${spring.mail.username}")
    private String email;
    @Value("${spring.mail.password}")
    private String password;

    @Autowired
    ThymeleafService thymeleafService;

    public void sendMail(String username, String resetLink, String toEmail, String title) throws MessagingException {
        Properties props = new Properties();
        props.put("mail.smtp.host", host);
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.port", port);

        Session session = Session.getInstance(props,
                new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(email, password);
                    }
                });
        log.info("Sending mail to " + toEmail);
        Message message = new MimeMessage(session);
            message.setRecipients(Message.RecipientType.TO, new InternetAddress[]{new InternetAddress(toEmail)});
            message.setFrom(new InternetAddress(email));
            message.setSubject(title);
            message.setContent(thymeleafService.getContent(username, resetLink), CONTENT_TYPE_TEXT_HTML);
            Transport.send(message);
        log.info("Sent mail to " + toEmail+ " successfully");
    }
}


