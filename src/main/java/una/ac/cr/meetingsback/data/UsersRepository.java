package una.ac.cr.meetingsback.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;
import una.ac.cr.meetingsback.logic.Meeting;
import una.ac.cr.meetingsback.logic.User;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
@Repository
public class UsersRepository {
    List<User> list;

    public User findById(String id) throws Exception{
        User r = list.stream()
                .filter( e-> e.getId().equals(id))
                .findFirst().get();
        return r.clone();
    }

    public UsersRepository() {
        list = new ArrayList<User>();
        var encoder = new BCryptPasswordEncoder();

       LinkedList<String> contacs =  new LinkedList<>();
       contacs.add("jairo@Example.com");
       contacs.add("cesar@example.com");
        Meeting m = new Meeting("Plan new movie","PUBLISHED","12/01/2024",contacs);
        User u = new User("jsanchez","{bcrypt}"+encoder.encode("1"),"ADM");
        u.addMeetings(m);
        list.add(u);
        u = new User("slee","{bcrypt}"+encoder.encode("1"),"CLI");
        Meeting m2 = new Meeting("Plan review","OVERDUE","09/15/2024",contacs);
        list.add(u);
    }
}
