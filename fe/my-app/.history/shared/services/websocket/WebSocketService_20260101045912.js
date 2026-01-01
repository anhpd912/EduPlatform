import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

export class WebSocketService {
  constructor(userId, onMessageReceived) {
    this.userId = userId;
    this.onMessageReceived = onMessageReceived;
    this.client = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.connected) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      debug: function (str) {
        console.log("STOMP Debug:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log("WebSocket Connected:", frame);
      this.connected = true;
      this.reconnectAttempts = 0;

      // Subscribe to personal messages
      this.client.subscribe(`/user/${this.userId}/queue/messages`, (message) => {
        const parsedMessage = JSON.parse(message.body);
        console.log("Received message:", parsedMessage);
        if (this.onMessageReceived) {
          this.onMessageReceived(parsedMessage);
        }
      });

      // Subscribe to broadcast/notifications
      this.client.subscribe(`/user/${this.userId}/queue/notifications`, (notification) => {
        const parsedNotification = JSON.parse(notification.body);
        console.log("Received notification:", parsedNotification);
      });
    };

    this.client.onStompError = (frame) => {
      console.error("STOMP Error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
      this.connected = false;
    };

    this.client.onDisconnect = () => {
      console.log("WebSocket Disconnected");
      this.connected = false;
      this.handleReconnect();
    };

    this.client.onWebSocketClose = () => {
      console.log("WebSocket connection closed");
      this.connected = false;
    };

    this.client.activate();
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => {
        this.connect();
      }, 3000 * this.reconnectAttempts);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  sendMessage(messageData) {
    if (!this.client || !this.connected) {
      console.error("WebSocket is not connected");
      return false;
    }

    try {
      this.client.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(messageData),
        headers: {
          "content-type": "application/json",
        },
      });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  }

  sendTypingStatus(recipientId, isTyping) {
    if (!this.client || !this.connected) return;

    this.client.publish({
      destination: "/app/chat.typing",
      body: JSON.stringify({
        senderId: this.userId,
        recipientId,
        isTyping,
      }),
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      console.log("WebSocket disconnected manually");
    }
  }

  isConnected() {
    return this.connected;
  }
}

// Singleton instance for global access
let wsInstance = null;

export const getWebSocketInstance = (userId, onMessageReceived) => {
  if (!wsInstance || wsInstance.userId !== userId) {
    if (wsInstance) {
      wsInstance.disconnect();
    }
    wsInstance = new WebSocketService(userId, onMessageReceived);
  }
  return wsInstance;
};

export const disconnectWebSocket = () => {
  if (wsInstance) {
    wsInstance.disconnect();
    wsInstance = null;
  }
};
