package org.example.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override//chỉ đường cho tin nhắn
    public void configureMessageBroker(MessageBrokerRegistry config) {
        log.info(" WebSocket: Configuring Message Broker");
        config.enableSimpleBroker("/topic", "/queue", "/user");
        config.setApplicationDestinationPrefixes("/app");
        log.info(" WebSocket: Message Broker configured");
    }

    @Override //cho client kết nối vào server
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        log.info(" WebSocket: Registering STOMP endpoint at /ws");
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS()
                .setInterceptors();
        log.info(" WebSocket: Endpoint /ws registered successfully with SockJS fallback");
    }
}
