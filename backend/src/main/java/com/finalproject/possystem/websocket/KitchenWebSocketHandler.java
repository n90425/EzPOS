package com.finalproject.possystem.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class KitchenWebSocketHandler extends TextWebSocketHandler {
    private Logger logger = LoggerFactory.getLogger(KitchenWebSocketHandler.class);
    private static final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());

    /* 클라이언트와 연결 */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        logger.info("{} 연결됨", session.getId());
        sessions.add(session);
        session.sendMessage(new TextMessage("{\"type\":\"INFO\", \"message\":\"주방서버와 연결되었습니다.\"}"));
    }

    /* 클라이언트가 WebSocket으로 메시지를 보냈을 때의 처리 */
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        logger.info("payload: " + payload);

        for(WebSocketSession s : sessions){
            if(s.isOpen()){
                try{
                    s.sendMessage(message);
                } catch(Exception e){
                    logger.error("메시지 전송 중 오류", e);
                }
            }
        }
    }

    /* 클라이언트 연결이 종료되면 세션에서 제거 */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        logger.info(session+ "웹소켓 해제");
        sessions.remove(session);
    }

    /* 서버에서 주방으로 메시지를 전송 */
    public void sendMessageToAll(String message) {
        synchronized (sessions){
            for(WebSocketSession session: sessions) {
                if(session.isOpen()){
                    try {
                        session.sendMessage(new TextMessage(message));
                    } catch (Exception e){
                        logger.error("메시지 전송 오류", e);
                    }
                }
            }
        }
    }
}
