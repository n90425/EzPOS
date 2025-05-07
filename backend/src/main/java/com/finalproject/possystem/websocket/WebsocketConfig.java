package com.finalproject.possystem.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebsocketConfig implements WebSocketConfigurer {

    private final KitchenWebSocketHandler kitchenWebSocketHandler;

    public WebsocketConfig(KitchenWebSocketHandler kitchenWebSocketHandler) {
        this.kitchenWebSocketHandler = kitchenWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("[+] 최초 WebSocket 연결을 위한 등록 Handler");
        registry.addHandler(kitchenWebSocketHandler, "/api/kitchen")
                .setAllowedOrigins("*");
    }
}
