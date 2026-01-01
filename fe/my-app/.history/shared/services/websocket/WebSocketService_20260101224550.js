import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws";

// Helper function to get fresh token
const getFreshToken = () => {
  return localStorage.getItem("jwt_token") || localStorage.getItem("accessToken");
};

export class WebSocketService {
  constructor(userId, onMessageReceived, onNotificationReceived) {
    this.userId = userId;
    this.onMessageReceived = onMessageReceived;
    this.onNotificationReceived = onNotificationReceived;
    this.client = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.subscriptions = [];
  }

  connect() {
    if (this.connected) return;

    // Get fresh token each time we connect
    const token = getFreshToken();
    
    if (!token) {
      console.error("No access token available for WebSocket connection");
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      // Use beforeConnect to get fresh token right before connecting
      beforeConnect: () => {
        const freshToken = getFreshToken();
        this.client.connectHeaders = {
          Authorization: `Bearer ${freshToken}`,
        };
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: function (str) {
        if (process.env.NODE_ENV === "development") {
          console.log("STOMP Debug:", str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = (frame) => {
      console.log("WebSocket Connected:", frame);
      this.connected = true;
      this.reconnectAttempts = 0;

      // Clear old subscriptions
      this.subscriptions = [];

      // Subscribe to personal messages
      const messageSub = this.client.subscribe(
        `/user/${this.userId}/queue/messages`,
        (message) => {
          const parsedMessage = JSON.parse(message.body);
          console.log("Received message:", parsedMessage);
          if (this.onMessageReceived) {
            this.onMessageReceived(parsedMessage);
          }
        }
      );
      this.subscriptions.push(messageSub);

      // Subscribe to broadcast/notifications
      const notificationSub = this.client.subscribe(
        `/user/${this.userId}/queue/notifications`,
        (notification) => {
          const parsedNotification = JSON.parse(notification.body);
          console.log("Received notification:", parsedNotification);
          if (this.onNotificationReceived) {
            this.onNotificationReceived(parsedNotification);
          }
        }
      );
      this.subscriptions.push(notificationSub);
    };

    this.client.onStompError = (frame) => {
      console.error("STOMP Error:", frame.headers["message"]);
      console.error("Additional details:", frame.body);
      this.connected = false;
      
      // Check if error is due to invalid/expired token
      const errorMessage = frame.headers["message"] || frame.body || "";
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("expired") ||
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("401")
      ) {
        console.log("Token expired, will reconnect with fresh token...");
        // Force reconnect with fresh token
        this.forceReconnect();
      }
    };

    this.client.onDisconnect = () => {
      console.log("WebSocket Disconnected");
      this.connected = false;
      this.handleReconnect();
    };

    this.client.onWebSocketClose = (event) => {
      console.log("WebSocket connection closed", event);
      this.connected = false;
      
      // Check if closed due to auth error (code 1008 = Policy Violation)
      if (event && (event.code === 1008 || event.code === 4001)) {
        console.log("WebSocket closed due to auth error, reconnecting with fresh token...");
        this.forceReconnect();
      }
    };

    this.client.activate();
  }

  // Force reconnect with fresh token
  forceReconnect() {
    this.disconnect();
    // Wait a bit for token to be refreshed, then reconnect
    setTimeout(() => {
      this.reconnectAttempts = 0; // Reset attempts
      this.connect();
    }, 1000);
  }

  // Update token and reconnect (call this after token refresh)
  updateTokenAndReconnect() {
    console.log("Updating WebSocket with new token...");
    this.forceReconnect();
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

export const getWebSocketInstance = (userId, onMessageReceived, onNotificationReceived) => {
  if (!wsInstance || wsInstance.userId !== userId) {
    if (wsInstance) {
      wsInstance.disconnect();
    }
    wsInstance = new WebSocketService(userId, onMessageReceived, onNotificationReceived);
  }
  return wsInstance;
};

export const disconnectWebSocket = () => {
  if (wsInstance) {
    wsInstance.disconnect();
    wsInstance = null;
  }
};

// Call this after token refresh to update WebSocket connection
export const refreshWebSocketConnection = () => {
  if (wsInstance && wsInstance.connected) {
    wsInstance.updateTokenAndReconnect();
  }
};
