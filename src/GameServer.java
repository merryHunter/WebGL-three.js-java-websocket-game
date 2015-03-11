import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Ivan on 05.03.2015.
 */
@ServerEndpoint(value = "/gameendpoint",
        encoders = {CoordinatesEncoder.class}, decoders = {CoordinatesDecoder.class})
public class GameServer {

    @OnOpen
    public void onOpen(Session peer) {
        System.out.println("onOpen GameServer");

    }

    @OnClose
    public void onClose(Session peer) {
    }

    @OnMessage
    public void onClick(Coordinates coordinates, Session session) throws
            IOException, EncodeException {
        System.out.println("broadcast hedgehog: ");
        session.getBasicRemote().sendObject(coordinates);
    }

}
