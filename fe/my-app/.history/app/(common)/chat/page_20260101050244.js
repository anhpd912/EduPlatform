"use client";
import { useState, useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import { authStore } from "@/store/authStore";
import { useLanguage } from "@/shared/contexts/LanguageContext";
import { translations } from "@/shared/translations/translations";
import { ChatService } from "@/shared/services/api/Chat/ChatService";
import { WebSocketService } from "@/shared/services/websocket/WebSocketService";
import styles from "./page.module.css";
import {
  Search,
  Send,
  Person,
  ArrowBack,
  MoreVert,
  InsertEmoticon,
  AttachFile,
  Class,
  People,
  Chat,
  ExpandMore,
  ExpandLess,
  School,
} from "@mui/icons-material";
import { toast } from "react-toastify";

export default function ChatPage() {
  const { userId, username, role } = useSnapshot(authStore);
  const { language } = useLanguage();
  const t = translations[language];

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [myClasses, setMyClasses] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState({});
  const [activeTab, setActiveTab] = useState("chats"); // "chats" or "classes"
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  const messagesEndRef = useRef(null);
  const wsServiceRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (userId) {
      wsServiceRef.current = new WebSocketService(userId, handleNewMessage);
      wsServiceRef.current.connect();

      return () => {
        if (wsServiceRef.current) {
          wsServiceRef.current.disconnect();
        }
      };
    }
  }, [userId]);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users for chat
  useEffect(() => {
    fetchUsers();
    fetchConversations();
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUsers = async () => {
    try {
      const response = await ChatService.getAllUsers();
      if (response.data) {
        // Filter out current user
        const filteredUsers = response.data.filter((u) => u.id !== userId);
        setUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await ChatService.getConversations();
      if (response.data) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (recipientId) => {
    setLoading(true);
    try {
      const response = await ChatService.getMessages(recipientId);
      if (response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(t.errorFetchingMessages || "Error fetching messages");
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    // Check if message belongs to current chat
    if (
      selectedChat &&
      (message.senderId === selectedChat.id ||
        message.recipientId === selectedChat.id)
    ) {
      setMessages((prev) => [...prev, message]);
    }
    // Update conversations list
    fetchConversations();
  };

  const handleSelectChat = (user) => {
    setSelectedChat(user);
    fetchMessages(user.id);
    if (isMobileView) {
      setShowChatList(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      senderId: userId,
      recipientId: selectedChat.id,
      content: newMessage.trim(),
    };

    try {
      // Send via WebSocket
      if (wsServiceRef.current) {
        wsServiceRef.current.sendMessage(messageData);
      }

      // Also send via API for persistence
      await ChatService.sendMessage(messageData);

      // Add to local messages
      const newMsg = {
        ...messageData,
        senderName: username,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(t.errorSendingMessage || "Error sending message");
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    setSelectedChat(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString(language === "vi" ? "vi-VN" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t.today || "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t.yesterday || "Yesterday";
    }
    return date.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US");
  };

  return (
    <div className={styles.chatContainer}>
      {/* Chat List Sidebar */}
      <div
        className={`${styles.chatList} ${
          isMobileView && !showChatList ? styles.hidden : ""
        }`}
      >
        <div className={styles.chatListHeader}>
          <h2>{t.messages || "Messages"}</h2>
        </div>

        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder={t.searchUsers || "Search users..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.usersList}>
          {/* Show conversations first */}
          {conversations.length > 0 && (
            <div className={styles.sectionTitle}>
              {t.recentChats || "Recent Chats"}
            </div>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.recipientId}
              className={`${styles.userItem} ${
                selectedChat?.id === conv.recipientId ? styles.active : ""
              }`}
              onClick={() =>
                handleSelectChat({
                  id: conv.recipientId,
                  username: conv.recipientName,
                  fullName: conv.recipientFullName,
                  avatar: conv.recipientAvatar,
                })
              }
            >
              <div className={styles.userAvatar}>
                {conv.recipientAvatar ? (
                  <img src={conv.recipientAvatar} alt={conv.recipientName} />
                ) : (
                  <Person />
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {conv.recipientFullName || conv.recipientName}
                </span>
                <span className={styles.lastMessage}>{conv.lastMessage}</span>
              </div>
              <span className={styles.messageTime}>
                {formatTime(conv.lastMessageTime)}
              </span>
            </div>
          ))}

          {/* All users */}
          <div className={styles.sectionTitle}>{t.allUsers || "All Users"}</div>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`${styles.userItem} ${
                selectedChat?.id === user.id ? styles.active : ""
              }`}
              onClick={() => handleSelectChat(user)}
            >
              <div className={styles.userAvatar}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <Person />
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {user.fullName || user.username}
                </span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={`${styles.chatWindow} ${
          isMobileView && showChatList ? styles.hidden : ""
        }`}
      >
        {selectedChat ? (
          <>
            <div className={styles.chatHeader}>
              {isMobileView && (
                <button
                  className={styles.backButton}
                  onClick={handleBackToList}
                >
                  <ArrowBack />
                </button>
              )}
              <div className={styles.chatHeaderUser}>
                <div className={styles.headerAvatar}>
                  {selectedChat.avatar ? (
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.username}
                    />
                  ) : (
                    <Person />
                  )}
                </div>
                <div className={styles.headerInfo}>
                  <span className={styles.headerName}>
                    {selectedChat.fullName || selectedChat.username}
                  </span>
                  <span className={styles.headerStatus}>
                    {t.online || "Online"}
                  </span>
                </div>
              </div>
              <button className={styles.moreButton}>
                <MoreVert />
              </button>
            </div>

            <div className={styles.messagesContainer}>
              {loading ? (
                <div className={styles.loadingMessages}>
                  {t.loadingMessages || "Loading messages..."}
                </div>
              ) : messages.length === 0 ? (
                <div className={styles.noMessages}>
                  <p>{t.noMessages || "No messages yet"}</p>
                  <span>{t.startConversation || "Start a conversation!"}</span>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const showDate =
                      index === 0 ||
                      formatDate(msg.timestamp) !==
                        formatDate(messages[index - 1]?.timestamp);

                    return (
                      <div key={index}>
                        {showDate && (
                          <div className={styles.dateDivider}>
                            <span>{formatDate(msg.timestamp)}</span>
                          </div>
                        )}
                        <div
                          className={`${styles.message} ${
                            msg.senderId === userId
                              ? styles.sent
                              : styles.received
                          }`}
                        >
                          <div className={styles.messageContent}>
                            <p>{msg.content}</p>
                            <span className={styles.messageTime}>
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form className={styles.messageInput} onSubmit={handleSendMessage}>
              <button type="button" className={styles.attachButton}>
                <AttachFile />
              </button>
              <button type="button" className={styles.emojiButton}>
                <InsertEmoticon />
              </button>
              <input
                type="text"
                placeholder={t.typeMessage || "Type a message..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className={styles.sendButton}
                disabled={!newMessage.trim()}
              >
                <Send />
              </button>
            </form>
          </>
        ) : (
          <div className={styles.noChatSelected}>
            <div className={styles.noChatIcon}>💬</div>
            <h3>{t.selectChat || "Select a chat"}</h3>
            <p>
              {t.selectChatDesc ||
                "Choose a user from the list to start chatting"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
