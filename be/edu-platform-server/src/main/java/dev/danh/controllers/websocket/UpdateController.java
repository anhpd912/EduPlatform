package dev.danh.controllers.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpdateController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendUpdate(Object updateData) {
        // Send the update to the WebSocket topic
        messagingTemplate.convertAndSend("/topic/updates", updateData);
    }

}