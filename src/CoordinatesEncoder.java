import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

/**
 * Created by Ivan on 05.03.2015.
 */
public class CoordinatesEncoder implements Encoder.Text<Coordinates> {
    @Override
    public String encode(Coordinates coordinates) throws EncodeException {
        return coordinates.getJson().toString();
    }

    @Override
    public void init(EndpointConfig endpointConfig) {
        System.out.println("init");
    }

    @Override
    public void destroy() {
        System.out.println("destroy");
    }
}
