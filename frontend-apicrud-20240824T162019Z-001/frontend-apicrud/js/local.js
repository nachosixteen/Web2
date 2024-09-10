//Variables globales de admin
const d = document;
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

d.addEventListener("DOMContentLoaded", () =>{
    getUser();
})

//Funcion para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("datosUser"));
    nameUser.textContent = user.nombre;
};
//Evento para el boton del logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("datosUser");
    location.href = "login.html"
});


  