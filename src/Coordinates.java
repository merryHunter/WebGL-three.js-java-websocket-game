import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonValue;
import javax.json.stream.JsonParser;
import java.io.StringReader;
import java.io.StringWriter;

/**
 * Created by Ivan on 05.03.2015.
 */
public class Coordinates {
    private JsonObject json;

    public Coordinates(JsonObject json) {
        this.json = json;

        JsonParser parser = Json.createParser(new StringReader(this.toString()));
        int c[] = new int[2];
        int i = 0;
        while (parser.hasNext()) {
            JsonParser.Event event = parser.next();
            switch (event) {
                case START_ARRAY:
                case END_ARRAY:
                case START_OBJECT:
                case END_OBJECT:
                case VALUE_FALSE:
                case VALUE_NULL:
                case VALUE_TRUE:
                    System.out.println(event.toString());
                    break;
                case KEY_NAME:
                    System.out.print(event.toString() + " " +
                            parser.getString() + " - ");
                    break;
                case VALUE_NUMBER:
                    c[i] = Integer.parseInt(parser.getString());
                    ++i;
                    break;
            }
        }
        this.i = c[0];
        this.j = c[1];
    }

    public Coordinates() {
    }

    public JsonObject getJson() {
        return json;
    }

    public void setJson(JsonObject json) {
        this.json = json;
    }


    private int i;
    private int j;


    public Coordinates(int i, int j) {
        this.i = i;
        this.j = j;
    }

    public int getI() {
        return i;
    }

    public void setI(int i) {
        this.i = i;
    }

    public int getJ() {
        return j;
    }

    public void setJ(int j) {
        this.j = j;
    }

    @Override
    public String toString() {
        StringWriter writer = new StringWriter();
        Json.createWriter(writer).write(json);
        return writer.toString();
    }
}
