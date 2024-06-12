package una.ac.cr.meetingsback.logic;

import java.io.Serializable;
import java.util.Objects;

public class Contact implements Serializable{
    String email;
    String name;

    public Contact() {
    }

    public Contact(String email, String name) {
        this.email = email;
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object other) {
        return Objects.equals(this.email, ((Contact)other).email);
    }
}


