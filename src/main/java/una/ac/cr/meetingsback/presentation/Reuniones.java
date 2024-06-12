package una.ac.cr.meetingsback.presentation;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import una.ac.cr.meetingsback.data.UsersRepository;
import una.ac.cr.meetingsback.logic.Contact;
import una.ac.cr.meetingsback.logic.Meeting;
import una.ac.cr.meetingsback.logic.User;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reuniones")
public class Reuniones {
    @Autowired
    UsersRepository userRepository;

    @GetMapping("/listar-reuniones")
    public List<Meeting> listarReuniones(@RequestParam String id) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return userRepository.findMeetingsByUsuarioId(id);
    }
    @GetMapping("/listar-contactos")
    public List<Contact> listarContactos(@RequestParam String id) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return userRepository.findContacsByUsuarioId(id);
    }
    @GetMapping("/contar-contactos")
    public Map<String, Integer> contarContactos(@RequestParam String id) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        return userRepository.countContactsByMeeting(id);
    }
    @GetMapping("/meetingById")
    public Meeting meetingById(@RequestParam String id) {
        if(id == null || id.isEmpty()){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        try {
            return userRepository.findMeetingById(id);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
