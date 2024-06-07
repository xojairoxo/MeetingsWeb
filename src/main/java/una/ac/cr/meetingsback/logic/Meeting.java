package una.ac.cr.meetingsback.logic;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.LinkedList;


public class Meeting {
    private String title;
    private String date;
    private String state;
    private LinkedList<String> contacs;

    public Meeting(String title, String date, String state, LinkedList<String> contacs) {
        this.title = title;
        this.date = date;
        this.state = state;
        this.contacs = contacs;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public LinkedList<String> getContacs() {
        return contacs;
    }

    public void setContacs(LinkedList<String> contacs) {
        this.contacs = contacs;
    }
}
