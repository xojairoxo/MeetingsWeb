package una.ac.cr.meetingsback.logic;

import java.util.LinkedList;

public class User {
    String id;
    String password;
    String rol;
    LinkedList<Meeting> meetings;
    public User(String id, String password, String rol) {
        this.id = id;
        this.password = password;
        this.rol = rol;
        this.meetings = new LinkedList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public User clone(){
        return new User(id,password,rol);
    }

    public LinkedList<Meeting> getMeetings() {
        return meetings;
    }
    public void addMeetings(Meeting m) {
        meetings.add(m);
    }

    public void setMeetings(LinkedList<Meeting> meetings) {
        this.meetings = meetings;
    }
}
