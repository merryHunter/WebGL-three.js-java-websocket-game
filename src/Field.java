import javax.json.*;
import java.io.StringWriter;

/**
 * Created by Ivan on 13.03.2015.
 */

/**
 * Field is a wrapper over game field.
 * It is served for sending data to client.
 */
public class Field {
    private JsonObject json;

    int[][] field;

    public Field(JsonObject json) {
        this.json = json;
    }

    public Field(int[][] field) {
        this.field = field;
        //setup json
        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();
        for (int[] i : field) {
            for (int j : i)
                jsonArrayBuilder.add(
                        Json.createObjectBuilder().add("v", j)
                );
        }
        JsonArray jsonArray = jsonArrayBuilder.build();
        json = Json.createObjectBuilder()
                .add("field", jsonArray)
                .build();
        //
        System.out.print("a");
    }

    public Field() {
    }

    public JsonObject getJson() {
        return json;
    }

    public void setJson(JsonObject json) {
        this.json = json;
    }

    public int[][] getField() {
        return field;
    }

    @Override
    public String toString() {
        StringWriter writer = new StringWriter();
        Json.createWriter(writer).write(json);
        return writer.toString();
    }

}
