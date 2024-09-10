//variables globales
let usuarioInput = document.querySelector("#usuarioForm");
let contraInput = document.querySelector("#contraForm ");
let btnLogin = document.querySelector(".btnLogin");

//evento al boton login
btnLogin.addEventListener("click", ()=>{
    //alert("usuario: "+usuarioInput.value+" y contraseña: "+contraInput.value);
    let userForm = validForm();
    sendData(userForm);
    console.log("datos del formulario");
    console.log(userForm);
});

//funcion para validar usuario y contraseña

let validForm = () =>{
    let userForm;
    if( usuarioInput.value && contraInput.value ){
        userForm = {
            usuario: usuarioInput.value,
            contrasena: contraInput.value
        }
    }else{
        alert("Usuario y contraseña son obligatorios")
    }
    return userForm;
}

//funcion para realizar la peticion al servidor

let sendData = async( userData )=>{
    let url = "http://localhost/backend-apiCrud/login";
    //realizar peticion
    try {
        let respuesta = await fetch(url,{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        //validar respuesta del servidor
        if ( respuesta.status == 401 ) {
            alert("Usuario y/o contraseña son incorrectos")
        }else{
            let data = await respuesta.json();
            alert("Bienvenido "+ data.nombre);
            //guardar los datos en localstorage
            localStorage.setItem("datosUser",JSON.stringify(data));
            //redirigir al dashboard
            location.href = "index.html";
            
        }
    } catch (error) {
        console.log(error);
    }
}
