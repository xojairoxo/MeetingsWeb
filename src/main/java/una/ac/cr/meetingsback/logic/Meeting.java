package una.ac.cr.meetingsback.logic;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;


public class Meeting {
    private String id;
    private String title;
    private String date;
    private String state;
    private List<Contact> contacs;

    public Meeting(String id, String title, String date, String state) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.state = state;
        this.contacs = new ArrayList<>();
    }

    public String getTitle() {
        return title;
    }
public int getContacsSize(){
        return contacs.size();
}
    public void setTitle(String title) {
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public List<Contact> getContacs() {
        return contacs;
    }

    public void setContacs(List<Contact> contacs) {
        this.contacs = contacs;
    }
}
