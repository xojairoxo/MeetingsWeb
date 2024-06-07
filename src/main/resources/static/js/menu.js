var backend="http://localhost:8080/api";
var api_login=backend+'/login'; //esto es para no estar poniendo lo mismo repetido durante todo el documento

var loginstate ={ //aqui se guardan los datos del usuario en la sesion como si fuera un localstorage
    logged: false,
    user : {id:"", rol:""}
}


async function menu(){ //primera en ejecucion
    await checkuser(); //hace el await para verificar el usuario en el sistema
    if (!loginstate.logged //si es falso y ademas anda en alguna pagina no autorizada lo devuelve al inicio
        && document.location.pathname != "/adhoc/login/View.html") {
        document.location = "/adhoc/login/View.html";
        throw new Error("Usuario no autorizado");
    }
    render_menu(); //hace render una vez llega la respuesta del checkuser();
}
async function checkuser(){
    let request = new Request(api_login+'/current-user', {method: 'GET'}); //llama al metodo del current-user del login que es un RestController
    const response = await fetch(request);
    if (response.ok) {
        loginstate.logged = true; //pone true en la variable que se utiliza para saber si hay un usuario logeado
        loginstate.user = await response.json(); //espera la respuesta del metodo current-user para igualar los datos simulando el uso de una sesion
    }
    else {
        loginstate.logged = false; //si falla en cualquier caso pone falsa la variable
    }
}


function render_menu() {
    if (!loginstate.logged) { //caso si es falso, renderiza una pagina inicial para hacer login y la ul con clase Menu es el header, por lo que en este caso solo muestra Login y Bienvenida
        html = `
<!--            <div class="logo">-->
<!--                <span>Personas</span>-->
<!--                <img src="/images/logo.webp">-->
<!--            </div>-->
<!--            <div>-->
<!--                <ul class="Menu">-->
<!--                    <li id="loginlink"><a href="#"> Login</a></li>-->
<!--                </ul>-->
<!--            </div>-->
            <header class="header-footer">
                <div class="logo">
                    <span>Meetings</span>
                    <img src="/images/logo.webp">       
                <div>
                <div>
                  <a id="loginlink" href="#" data-bs-toggle="modal" data-bs-target="#loginModal"> Login</a>
                </div>  
            </header>
        `; //hasta aqui la variable html es un string
        document.querySelector('#menu').innerHTML = html; //cambia el html de todos los que tengan la clase menu o id <header class="header" id="menu"></header>
        document.querySelector("#menu #loginlink").addEventListener('click', render_loginview); //agarra el <li id="loginlink"><a href="#"> Login</a></li> que fue creado arriba
        //para agregarle un evento para el click con ask que es una funcion abajo desarrollada
        render_loginoverlay(); //esto crea el div con la clase que contendra todos los elementos html para el login
        render_loginview();
    } else { //caso si es verdadero
        html = `
            <div class="logo">
                <span>Personas</span>
                <img src="/images/logo.jpg">
            </div>
            <div>
                <ul class="Menu">
                    <li id="bienvenidalink"><a href="#"> Bienvenida</a></li>
                    <li id="personaslink"><a href="#"> Personas</a></li>
                    <li id="logoutlink"><a href="#"> Logout</a></li>
                </ul>
            </div>
            <div class="user">&nbsp &nbsp ${loginstate.user.id}</div>
        `;
        document.querySelector('#menu').innerHTML = html;
        document.querySelector("#menu #logoutlink").addEventListener('click', logout);
        document.querySelector("#menu #bienvenidalink").addEventListener('click', e => {
            document.location = "/adhoc/login/View.html";
        });
        document.querySelector("#menu #personaslink").addEventListener('click', e => {
            document.location = "/adhoc/meetings/View.html";
        });
    }
}

function render_loginoverlay() {
    html = `
        <div id="loginoverlay" class="loginoverlay"></div>
    `; //crea el div con id loginoverlay y clase loginoverlay, aqui se desplegara todo para el login
    overlay=document.createElement('div');
    overlay.innerHTML=html; //modifica el html del div creado en el dom
    document.body.appendChild(overlay);//lo mete en el dom
    document.querySelector("#loginoverlay").addEventListener("click",toggle_loginview);//les agrega el evento de click con toggle_loginview
}

function ask(event){
    event.preventDefault(); //no actualiza por defecto la pagina
    toggle_loginview();//hace el pop up para el inicio de sesion
    document.querySelectorAll('#loginview input').forEach( (i)=> {i.classList.remove("invalid");}); //a cada elemento de la clase loginview y sea un input lo invalida
    document.querySelector("#loginview #id").value = ""; //limpia valores para el login
    document.querySelector("#loginview #password").value = "";//limpia valores para el login
}

function toggle_loginview(){
    document.getElementById("loginoverlay").classList.toggle("active"); //activa los elementos con estos ids que estaban 'ocultos'
    document.getElementById("loginview").classList.toggle("active");
}

// function render_loginview() { //aqui creamos el html necesario para el login
//     html = `
//     <div id="loginview" class='loginview'>
//         <div class='col-12'>
//             <div>
//                 <form name="formulario">
//                     <div class='container'>
//                         <div class='row'><div class='col-12 text-centered cooper'>Login</div></div>
//                         <div class='row'><div class='col-3 text-right'>Id</div><div class='col-6'><input type="text" name="id" id="id" value=""></div></div>
//                         <div class='row'><div class='col-3 text-right'>Clave</div><div class='col-6'><input type="password" name="password" id="password" value=""></div></div>
//                         <div class='row'>
//                             <div class='col-6 text-centered cooper'>
//                                 <input id="login" class="boton" type="button" value="Login">
//                                 &nbsp
//                                 <input id="cancelar" class="boton" type="button" value="Cancelar">
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     </div>
//     `; //hasta aqui es un string
//     view=document.createElement('div'); //crea el view como un div y lo agrega al dom
//     view.innerHTML=html; //lo convierte a html
//     document.body.appendChild(view);
//     document.querySelector("#loginview #login").addEventListener("click",login);//evento para el boton de login
//     document.querySelector("#loginview #cancelar").addEventListener("click",toggle_loginview); //evento para el boton de cancelar
// }

function render_loginview(){
    html = `
  <div class="modal fade" id="loginview" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">Inicio de Sesión</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="username" class="form-label">Usuario:</label>
              <input type="text" id="username" class="form-control">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña:</label>
              <input type="password" id="password" class="form-control">
            </div>
            <button type="submit" class="btn btn-primary" value="Login">Iniciar Sesión</button>
            <button type="submit" class="btn btn-primary" value="Cancelar">Cancelar</button>
          </form>
        </div>
      </div>
    </div>
  </div>
    `;
        view=document.createElement('div'); //crea el view como un div y lo agrega al dom
    view.innerHTML=html; //lo convierte a html
}





function login(){
    let user={id:document.getElementById("id").value,
        password:document.getElementById("password").value
    }; //hace un objeto con los valores del id y password que hayamos puesto en los campos correspondientes
    let request = new Request(api_login+'/login', {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(user)}); //el body es lo que solicita el metodo de login que es @RequestBody del metodo login
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        document.location="/adhoc/meetings/View.html"; //caso de respuesta=ok 200, usuario valido
    })();
}

function logout(event){
    event.preventDefault();
    let request = new Request(api_login+'/logout', {method: 'POST'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        sessionStorage.clear();
        loginstate.logged=false;
        document.location="/adhoc/login/View.html"; //repuesta ok, 200
    })();
}




function errorMessage(status,place){ //manejo de errores
    switch(status){
        case 404: error= "Registro no encontrado"; break;
        case 409: error="Registro duplicado"; break;
        case 401: error="Usuario no autorizado"; break;
        case 403: error="Usuario no tiene derechos"; break;
    }
    window.alert(error);
}
