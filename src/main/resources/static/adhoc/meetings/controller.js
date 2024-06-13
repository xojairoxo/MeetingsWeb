var api =backend+'/reuniones';

var state ={
    list: [],
    item : {id:"", title:"", state:"",date:""},
    contacts: [{email:"", name:""}],
    cantidadContactos : {},
    mode: "", // ADD, EDIT
    meeting : {id:"", title:"", state:"",date:""}
}

document.addEventListener("DOMContentLoaded",loaded);

async function loaded(event) {
    try {
        await menu();
    } catch (error) {
        return;
    }
    fetchAndList();
    fetchCantidadContactos();
    render_addOverlay();
    render_loginview();
    document.querySelector(" #add").addEventListener('click', ask);
    document.querySelector("#contactSelect").addEventListener('click', populateContactSelect);
    // document.querySelector("#addContactBtn").addEventListener('click', addSelectedContact);
}
function populateContactSelect() {
    const select = document.getElementById('contactSelect');
    state.contacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact.email;
        option.textContent = contact.email;
        select.appendChild(option);
    });
    state.contacts.forEach(contact => {
        console.log(contact.email);
    })
}
function addSelectedContact() {
    const select = document.getElementById('contactSelect');
    const email = select.value;
    if (email && !state.contacts.includes(email)) {
        state.contacts.push(email);
        // renderContactList();
    }
}

function fetchAndList(){
    const request = new Request(api+`/listar-reuniones?id=${loginstate.user.id}`, {method: 'GET', headers: { }});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        state.list = await response.json();
        render_list();
    })();
}

function fetchCantidadContactos(){
    const request = new Request(api+`/contar-contactos?id=${loginstate.user.id}`, {method: 'GET', headers: { }});
    (async ()=> {
        const response = await fetch(request);
        if (!response.ok) {
            errorMessage(response.status);
            return;
        }
        state.cantidadContactos =  await response.json();
        render_list();
    })();
}
function fetchMeetingDetails(id) {
    const meetingRequest = new Request(api + `/meetingById?id=${id}`, { method: 'GET', headers: {} });
    const contactsRequest = new Request(api + `/listar-contactos?id=${id}`, { method: 'GET', headers: {} });

    (async () => {
        try {
            const [meetingResponse, contactsResponse] = await Promise.all([
                fetch(meetingRequest),
                fetch(contactsRequest)
            ]);

            if (!meetingResponse.ok || !contactsResponse.ok) {
                errorMessage(meetingResponse.status || contactsResponse.status);
                return;
            }

            const meeting = await meetingResponse.json();
            const contacts = await contactsResponse.json();

            render_details_meetings(meeting, contacts);
        } catch (error) {
            console.error('Failed to fetch meeting details and contacts:', error);
        }
    })();
}
function render_list(){
    var listado=document.getElementById("list");
    listado.innerHTML="";
    state.list.forEach( item=>render_list_item(listado,item));
}
function render_list_item(listado,item){
    var tr =document.createElement("tr");
    var cantidadContactos = state.cantidadContactos[item.id] || 0;

    tr.innerHTML=`<td>${item.title}</td>
                    <td>${item.state}</td>
                    <td>${item.date}</td>
                    <td>${cantidadContactos}</td>`;
    // tr.querySelector("#edit").addEventListener("click",()=>{edit(item.title);});
    // tr.querySelector("#delete").addEventListener("click",()=>{remove(item.title);});
    tr.addEventListener('click', () => {
        fetchMeetingDetails(item.id);
    });
    listado.append(tr);
}
function ask(event){
    event.preventDefault();
    toggle_loginview();
    document.querySelectorAll('#addview input').forEach( (i)=> {i.classList.remove("invalid");});
}
function render_addOverlay() {
    html = `
        <div id="addOverlay" class="loginoverlay"></div>
    `;
    overlay=document.createElement('div');
    overlay.innerHTML=html;
    document.body.appendChild(overlay);
    document.querySelector("#addOverlay").addEventListener("click",toggle_loginview);
}
function render_loginview() {
    html = `
    <div id="addview" class='loginview'>
        <div class='col-12'>
            <div>
                <form name="formulario">
                    <div class='container'>
                        <div class='row'><div class='col-12 text-centered cooper'>New Meeting</div></div>
                        <div class='row'><div class='col-3 text-right'>Title</div><div class='col-6'><input type="text" name="title" id="title" value=""></div></div>
                        <div class='row'><div class='col-3 text-right'>State</div><div class='col-6'><input type="text" name="state" id="state" value=""></div></div>
                        <div class='row'><div class='col-3 text-right'>Date</div><div class='col-6'><input type="text" name="date" id="date" value=""></div></div>
                        <div class='row'><div class='col-3 text-right'>Contacts</div>
                        <div class="contact-buttons">
                            <button class="btn btn-primary btn-add" id="addContactBtn">+</button>
                            <select class="form-control" id="contactSelect">
                                <option id="select" value="">Select contact</option>
                                <!-- Options will be populated by JavaScript -->
                            </select>
                            <span class="ml-2">OR</span>
                            <input type="email" class="form-control ml-2" id="newContactEmail" placeholder="Enter new contact email">
                            <button class="btn btn-primary btn-new-contact" id="addNewContactBtn">+</button>
                        </div>
                            <div id="contactList"></div>
                        <div class='row'>
                            <div class='col-6 text-centered cooper'>
                                <input id="add" class="boton" type="button" value="Agregar">
                                &nbsp
                                <input id="cancelar" class="boton" type="button" value="Cancelar">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>    
    `;
    view=document.createElement('div');
    view.innerHTML=html;
    document.body.appendChild(view);
    document.querySelector("#addview #add").addEventListener("click",login);
    document.querySelector("#addview #cancelar").addEventListener("click",toggle_loginview);
}

function toggle_loginview(){
    document.getElementById("addOverlay").classList.toggle("active");
    document.getElementById("addview").classList.toggle("active");
}
function render_details_meetings(meeting, contacts) {
    var details = document.getElementById("details");
    details.innerHTML = `
        <h2>Title: ${meeting.title}</h2>
        <p>State: ${meeting.state}</p>
        <p>Date: ${meeting.date}</p>
        <h3>Contacts</h3>
    `;
    contacts.forEach(contact => {
        details.innerHTML += `<p>${contact.email}</p>`;
    });
}
