import javax.json.Json;
import javax.json.JsonObject;
import java.io.StringWriter;

/**
 * Created by Ivan on 05.03.2015.
 */
public class Coordinates {
    private JsonObject json;

    public Coordinates(JsonObject json) {
        this.json = json;
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
