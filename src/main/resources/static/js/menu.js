var backend="http://localhost:8080/api";
var api_login=backend+'/login';
var loginstate ={
    logged: false,
    user : {id:"", rol:""}
}

async function checkuser(){
    let request = new Request(api_login+'/current-user', {method: 'GET'});
    const response = await fetch(request);
    if (response.ok) {
        loginstate.logged = true;
        loginstate.user = await response.json();
    }
    else {
        loginstate.logged = false;
    }
}

async function menu(){
    await checkuser();
    if (!loginstate.logged
        && document.location.pathname != "/adhoc/login/View.html") {
        document.location = "/adhoc/login/View.html";
        throw new Error("Usuario no autorizado");
    }
    render_menu();
}

function render_menu() {
    if (!loginstate.logged) {
        html = `
            <div class="logo">
                <span>Meetings!!</span>
                <img src="/images/logo.webp">
            </div>
            <div>
                <ul class=  "Menu">
                        <li id="loginlink"> <img src="/images/login-logo.svg" alt="login-logo"><a href="#"> Login</a></li>
<!--                            <li id="loginlink"> <img src="/images/login-logo.svg" alt="login-logo"> <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal"> Login</a></li>-->
                </ul>
            </div>
        `;
        document.querySelector('#menu').innerHTML = html;
        document.querySelector("#menu #loginlink").addEventListener('click', ask);
        render_loginoverlay();
        render_loginview();
        renderFooter();
    }
    else {
        html = `
            <div class="logo">
                <span>Meetings list!!!</span>
                <img src="/images/logo.webp">
            </div>
            <div>
                <ul class="Menu">
                    <li id="logoutlink"><a href="#"> Logout</a></li> <div class="user">${'(' + loginstate.user.id + ')'} </div>
                </ul>
            </div>
        `;
        document.querySelector('#menu').innerHTML = html;
        document.querySelector("#menu #logoutlink").addEventListener('click', logout);
        renderFooter();
    }
}

function render_loginoverlay() {
    html = `
        <div id="loginoverlay" class="loginoverlay"></div>
    `;
    overlay=document.createElement('div');
    overlay.innerHTML=html;
    document.body.appendChild(overlay);
    document.querySelector("#loginoverlay").addEventListener("click",toggle_loginview);
}

function render_loginview() {
    html = `
    <div id="loginview" class='loginview'>
        <div class='col-12'>
            <div>
                <form name="formulario">
                    <div class='container'>
                        <div class='row'><div class='col-12 text-centered cooper'>Login</div></div>
                        <div class='row'><div class='col-3 text-right'>Id</div><div class='col-6'><input type="text" name="id" id="id" value=""></div></div>
                        <div class='row'><div class='col-3 text-right'>Clave</div><div class='col-6'><input type="password" name="password" id="password" value=""></div></div>
                        <div class='row'>
                            <div class='col-6 text-centered cooper'>
                                <input id="login" class="boton" type="button" value="Login">
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
    document.querySelector("#loginview #login").addEventListener("click",login);
    document.querySelector("#loginview #cancelar").addEventListener("click",toggle_loginview);
}
function renderFooter(){
    html = `
    <footer  id="footer" class="footer mt-4 w-100 fixed-bottom">
            <div class="container-fluid py-2">

                <div class="row">
                    <div class="col-md-2"><h5>Total Soft Inc.</h5></div>
                    <div class="col-md-7"><h4>
                        <i class="fab fa-twitter"></i>
                        <i class="fab fa-facebook"></i>
                        <i class="fab fa-instagram"></i></h4>
                    </div>
                    <div class="col-md-3 text-right small align-self-end">©2023 Tsf, Inc.</div>
                </div>
            </div>
        </footer> 
                        `
    view=document.createElement('div');
    view.innerHTML=html;
    document.body.appendChild(view);
}
function ask(event){
    event.preventDefault();
    toggle_loginview();
    document.querySelectorAll('#loginview input').forEach( (i)=> {i.classList.remove("invalid");});
    document.querySelector("#loginview #id").value = "";
    document.querySelector("#loginview #password").value = "";
}

function toggle_loginview(){
    document.getElementById("loginoverlay").classList.toggle("active");
    document.getElementById("loginview").classList.toggle("active");
}

function login(){
    let user={id:document.getElementById("id").value,
        password:document.getElementById("password").value
    };
    let request = new Request(api_login+'/login', {method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(user)});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}

        document.location="/adhoc/meetings/View.html";
    })();
}

function logout(event){
    event.preventDefault();
    let request = new Request(api_login+'/logout', {method: 'POST'});
    (async ()=>{
        const response = await fetch(request);
        if (!response.ok) {errorMessage(response.status);return;}
        document.location="/adhoc/login/View.html";
    })();
}

function errorMessage(status,place){
    switch(status){
        case 404: error= "Registro no encontrado"; break;
        case 409: error="Registro duplicado"; break;
        case 401: error="Usuario no autorizado"; break;
        case 403: error="Usuario no tiene derechos"; break;
    }
    window.alert(error);
}


