/**
 * Created by Ivan on 10.03.2015.
 */

import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.Random;

/**
 * Logic of game where hedgehog eats an
 * apples randomly placed on the field.
 */
public class Game {
    public static final int N = 10;

    public static final int HEDGEHOG = 2;

    public static final int APPLE = 1;

    public static final int EMPTY = 0;

    private int[][] field;

    private int score = 0;
    PrintWriter writer;

    /**
     * Number of apples currently placed on the field.
     * */
    private int currentApples = 10;

    /**
     * In fact in contains i and j position,
     * to get i : currentPosition / 10
     * to get j : currentPosition % 10
     */
    private int currentPosition = 0;

    private int currentRow = 9;

    private int currentColumn = 0;

    Game() {
        field = new int[N][];
        for (int i = 0; i < N; ++i)
            field[i] = new int[N];

        //place apples randomly
        Random rand = new Random();
        for (int i = 0; i < N; ++i) {
            int j = rand.nextInt(N);
            //apple here
            field[i][j] = APPLE;
        }

        //hedgehog position
        field[currentRow][currentColumn] = HEDGEHOG;
    }

    public int getFieldCell(int i, int j) {
        return field[i][j];
    }

    public int[][] getField() {
        return field;
    }

    public void setFieldCell(int i, int j, int value) {
        field[i][j] = value;
    }

    public int makeMove(int i, int j) {
        try {
            writer = new PrintWriter("server-log.txt", "UTF-8");

            //hedgehog frees place
            field[currentRow][currentColumn] = EMPTY;
            //hedgehog makes move
            currentRow = i;
            currentColumn = j;

            currentPosition = i * 10 + j;
            writer.println("field[i][j]  " + i + " " + j);
            //if apple placed here
            if (field[i][j] == APPLE) {
                writer.println("Apple eaten at " + i + " " + j);
                score += 10;
                --currentApples;
            }

            field[i][j] = HEDGEHOG;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } finally {
            writer.close();
        }
        return score;
    }

    public int getScore() {
        return score;
    }

    public int getCurrentPosition() {
        return currentPosition;
    }

    public int getCurrentRow() {
        return currentRow;
    }

    public int getCurrentColumn() {
        return currentColumn;
    }

    public boolean isGameEnd() {
        return currentApples == 0;
    }
}
