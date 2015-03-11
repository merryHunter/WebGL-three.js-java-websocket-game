/**
 * Created by Ivan on 10.03.2015.
 */

/**
 * Logic of game where hedgehog eats an
 * apples randomly placed on the field.
 */
public class Game {
    public static final int N = 10;

    private int[][] field;

    private int score = 0;

    /**
     * In fact in contains i and j position,
     * to get i : currentPosition / 10
     * to get j : currentPosition % 10
     */
    private int currentPosition = 0;

    Game() {
        for (int i = 0; i < N; ++i)
            field[i] = new int[N];
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
        currentPosition = i * 10 + j;
        //if apple placed here
        if (field[i][j] == 1) {
            score += 10;
            field[i][j] = 0;
        }

        return score;
    }

    public int getScore() {
        return score;
    }

    public int getCurrentPosition() {
        return currentPosition;
    }
}
