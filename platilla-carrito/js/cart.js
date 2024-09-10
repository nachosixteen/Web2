//varaibles globales
let iconCart = document.querySelector(".carrito");
let iconCount = document.querySelector(".contar-pro");
let btnProducts = document.querySelectorAll(".btn-product");
let contentProducts = document.querySelector(".content-pro");
let listCart = document.querySelector(".list-cart tbody");
let btnCart = document.querySelector(".btn-cart");
let con = 1;

//evento al navegador para cargar los productos
document.addEventListener("DOMContentLoaded", ()=>{
        getProductData()
});


// Funcion para obtener la informacion del producto
let  getInfoProduc = (id)=>{
    let products = [];
    let productPrevius = JSON.parse(localStorage.getItem("productos"));
    if( productPrevius != null){
        products = Object.values(productPrevius);
    }
    //console.log(products[id]);
    // LLamar la funcion addProCart
    addProCart(products[id]);
    //Agregar evento al boton ver carrito
    btnCart.addEventListener("click", ()=>{
        storageProduct(products[id]);
    });
    iconCount.textContent = con++;

    //agregar evento al icono del carrito 
    iconCart.addEventListener("click", ()=>{
        if (listCart.parentElement.style.display == "none") {
            listCart.parentElement.style.display = "block";    
        }else{
            listCart.parentElement.style.display = "none";
        }
        
    });
};

//Funcion para guardar los productos del carrito en localstorage
let storageProduct = ( product )=>{
    let products = [];
    let productPrevius = JSON.parse(localStorage.getItem("carrito"));
    if( productPrevius != null){
        products = Object.values(productPrevius);
    }
    products.push(product);
    localStorage.setItem("carrito", JSON.stringify(products));
    location.href= "cart.html";
}

//Funcion para llevar la info del producto al carrito
let addProCart = ( prod )=>{
    let row = document.createElement("tr");
    row.innerHTML = `
        <td> ${con}</td>
        <td> <img src="${prod.imagen}" width="100%" ></td>
        <td> ${prod.nombre}</td>
        <td> ${prod.precio}</td>
        <td>
            <button onclick="deleteCart(${con});" type="button" class="btn-delete btn text-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </button>
        </td>
    `;
    listCart.appendChild(row);

    //Actualiza el contador despues de agregar el producto
    iconCount.textContent = document.querySelectorAll(".list-cart tbody tr").length;

    // Asignar el evento de eliminar dinámicamente
    row.querySelector(".btn-delete").addEventListener("click", function() {
        deleteCart(row);
    });
};

// Funcion para eliminar producto del carrito
let deleteCart = ( row )=>{
    // Eliminar la fila seleccionada
    row.remove();

    // Actualizar el contador al número actual de productos en el carrito
    let itemsInCart = document.querySelectorAll(".list-cart tbody tr").length;
    iconCount.textContent = itemsInCart;

    // Reiniciar `con` cuando se eliminan todos los productos
    if (itemsInCart === 0) {
        iconCount.textContent = 0;
        con = 1; // Resetear el contador de productos
    }
};

//Funcion para traer los datos de la DB a la tienda
let getProductData = async ()=>{
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url,{
            method: "GET",
            headers:{
                "Content-type":"application/json"
            },
        });
    //Validar respuesta del servidor
        if(respuesta.status == 204 ){
            console.log("No hay datos en la DB");
        }else{
            let tableData = await respuesta.json();
            console.log(tableData);
            //Agregar los datos de la tabla en local storage
            localStorage.setItem("productos", JSON.stringify(tableData));
            //Agregar los datos a la tabla
            tableData.forEach((dato, i)=> {
                
                contentProducts.innerHTML += `
                    <td> ${i+1} </td>
                        <div class="col-md-3 py-3 py-md-0">
                            <div class="card">
                            <img src="${dato.imagen}" alt="">
                            <div class="card-body">
                                <h3>${dato.nombre}</h3>
                                <p>${dato.descripcion}</p>
                                <h5>$${dato.precio}
                                    <span class="btn-product" onclick="getInfoProduc(${i})"><i class="fa-solid fa-basket-shopping"></i></span>
                                </h5>
                            </div>
                            </div>
                        </div>
                `;
                
            });
        }
    } catch (error) {
        console.log(error);
    }
};