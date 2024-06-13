package una.ac.cr.meetingsback.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import una.ac.cr.meetingsback.logic.Contact;
import una.ac.cr.meetingsback.logic.Meeting;
import una.ac.cr.meetingsback.logic.User;

import java.util.*;

@Repository
public class UsersRepository {
    List<User> list;
    List<Meeting> meetings;

    public UsersRepository() {
        meetings = new ArrayList<>();
        list = new ArrayList<User>();
        var encoder = new BCryptPasswordEncoder();
        Meeting m = new Meeting("1", "Plan new movie", "PUBLISHED", "12/01/2024");
        m.getContacs().add(new Contact("jairo@example.com", "Jairo"));
        m.getContacs().add(new Contact("cesar@example.com", "Cesar"));
        this.meetings.add(m);
        Meeting m2 = new Meeting("2", "Plan review", "OVERDUE", "09/15/2024");
        m2.getContacs().add(new Contact("juan@example.com", "Juan"));
        m2.getContacs().add(new Contact("pedro@example.com", "Pedro"));
        this.meetings.add(m2);

        User u = new User("jsanchez", "{bcrypt}" + encoder.encode("1"), "ADM");
        u.addMeetings(m);
        u.addMeetings(m2);
        list.add(u);

        u = new User("slee", "{bcrypt}" + encoder.encode("1"), "CLI");

        list.add(u);
    }

    public User findById(String id) throws Exception {
        User r = list.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst().get();
        return r.clone();
    }

    public List<Meeting> findMeetingsByUsuarioId(String id) {
        User r = list.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst().get();
        return r.getMeetings();
    }

  public List<Contact> findContacsByMeetingId(String id) {
        Meeting r = meetings.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst().get();
        return r.getContacs();
    }
    public Map<String, Integer> countContactsByMeeting(String userId) {
        Map<String, Integer> meetingContactsCount = new HashMap<>();

        // Itera sobre todas las reuniones del usuario con el ID proporcionado
        for (Meeting meeting : this.findMeetingsByUsuarioId(userId)) {
            // Cuenta el número de contactos en la reunión
            int numberOfContacts = meeting.getContacs().size();

            // Almacena el título de la reunión y el número de contactos en el mapa
            meetingContactsCount.put(meeting.getId(), numberOfContacts);
        }
        return meetingContactsCount;
    }
    public Meeting addMeeting(Meeting meeting) {
        meetings.add(meeting);
        return meeting;
    }

    public Meeting findMeetingById(String id) {
        return meetings.stream()
                .filter(e -> e.getId().equals(id))
                .findFirst().get();
    }
}
