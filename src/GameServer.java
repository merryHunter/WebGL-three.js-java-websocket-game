import javax.json.Json;
import javax.json.JsonObject;
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
        encoders = {CoordinatesEncoder.class, FieldEncoder.class},
        decoders = {CoordinatesDecoder.class, FieldDecoder.class})
public class GameServer {

    private Game game;

    private Field field;

    @OnOpen
    public void onOpen(Session peer) {
        System.out.println("onOpen GameServer");
        try {
            initGame(peer);
        } catch (IOException e) {
            //send error message
        } catch (EncodeException e) {
            //send error message
        }
    }

    private void initGame(Session peer) throws IOException, EncodeException {
        game = new Game();
        field = new Field(game.getField());
        peer.getBasicRemote().sendObject(field);

        JsonObject jsonScore = Json.createObjectBuilder()
                .add("score", game.getScore())
                .build();
        peer.getBasicRemote().sendObject(jsonScore);
    }

    @OnClose
    public void onClose(Session peer) {
    }

    @OnMessage
    public void onClick(Coordinates coordinates, Session session) throws
            IOException, EncodeException {
        System.out.println("broadcast hedgehog: ");
        game.makeMove(coordinates.getI(), coordinates.getJ());
        //send model
        field = new Field(game.getField());
        session.getBasicRemote().sendObject(field);

        //send score
        JsonObject jsonScore = Json.createObjectBuilder()
                .add("score", game.getScore())
                .build();
        session.getBasicRemote().sendObject(jsonScore);

        //send if game ended message
        if (game.isGameEnd()) {
            session.getBasicRemote().sendObject("Win!");
        }
    }

}
