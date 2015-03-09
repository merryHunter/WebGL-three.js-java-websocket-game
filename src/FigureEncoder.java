import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

/**
 * Created by Ivan on 05.03.2015.
 */
public class FigureEncoder implements Encoder.Text<Figure> {
    @Override
    public String encode(Figure figure) throws EncodeException {
        return figure.getJson().toString();
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
