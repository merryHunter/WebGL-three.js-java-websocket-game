import javax.websocket.EncodeException;
import javax.websocket.Encoder;
import javax.websocket.EndpointConfig;

/**
 * Created by Ivan on 13.03.2015.
 */
public class FieldEncoder implements Encoder.Text<Field> {

    @Override
    public String encode(Field field) throws EncodeException {
        return field.getJson().toString();
    }

    @Override
    public void init(EndpointConfig endpointConfig) {

    }

    @Override
    public void destroy() {

    }
}
