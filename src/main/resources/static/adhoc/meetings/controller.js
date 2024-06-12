var api =backend+'/reuniones';

var state ={
    list: [],
    item : {id:"", title:"", state:"",date:""},
    contacts: [{email:"", name:""}],
    cantidadContactos : {},
    mode: "" // ADD, EDIT
    // private String title;
    // private String date;
    // private String state;
    // private LinkedList<String> contacs;
}

document.addEventListener("DOMContentLoaded",loaded);

async function loaded(event) {
    try {
        await menu();
    } catch (error) {
        return;
    }
    fetchAndList();
    fetchContacs();
    fetchCantidadContactos();
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
function fetchContacs(){
    const request = new Request(api+`/listar-contactos?id=${loginstate.user.id}`, {method: 'GET', headers: { }});
    (async ()=> {
        const response = await fetch(request);
        if (!response.ok) {
            errorMessage(response.status);
            return;
        }
        state.contacts =  await response.json();
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
function fetchMeeting(id){
    const request = new Request(api+`/meetingById?id=${id}`, {method: 'GET', headers: { }});
    (async ()=> {
        const response = await fetch(request);
        if (!response.ok) {
            errorMessage(response.status);
            return;
        }
        state.item =  await response.json();
        // render_details_meetings(state.item);
    })();

}

function render_list(){
    var listado=document.getElementById("list");
    listado.innerHTML="";
    state.list.forEach( item=>render_list_item(listado,item));
    state.contacts.forEach( item=>render_list_contacts(item));
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
    listado.append(tr);
    tr.onclick(this.fetchMeeting(item.id));
}
function render_details_meetings(item){
    var details=document.getElementById("details");
    details.innerHTML="";
    details.innerHTML=`<h2>${item.title}</h2>
                        <p>${item.date}</p>
                        <p>${item.state}</p>`;
}