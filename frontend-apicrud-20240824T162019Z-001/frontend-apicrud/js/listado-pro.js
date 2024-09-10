// Variables globales
let tablePro = document.querySelector("#table-pro > tbody");
let searchInput = document.querySelector("#search-input");
let nameUser = document.querySelector("#nombre-usuario");
let btnLogout = document.querySelector("#btnLogout");

// Función para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("datosUser"));
    nameUser.textContent = user.nombre;
};

// Evento para el botón de logout
btnLogout.addEventListener("click", () => {
    localStorage.removeItem("datosUser");
    location.href = "login.html";
});

// Evento para probar el campo de búsqueda
searchInput.addEventListener("keyup", () => {
    searchProductTable();
});

// Evento para el navegador
document.addEventListener("DOMContentLoaded", () => {
    getTableData();
    getUser();
});

// Función para traer los datos de la db a la tabla
let getTableData = async () => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (respuesta.status == 204) {
            console.log("No hay datos en la BD");
        } else {
            let tableData = await respuesta.json();
            // Agregar los datos al localStorage
            localStorage.setItem("datosTabla", JSON.stringify(tableData));
            // Inicializar la tabla con los datos
            displayProducts(tableData);
        }
    } catch (error) {
        console.log(error);
    }
};

// Función para mostrar productos en la tabla
let displayProducts = (products) => {
    clearDataTable();
    products.forEach((dato, i) => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td> ${i + 1} </td>
            <td> ${dato.nombre} </td>
            <td> ${dato.descripcion} </td>
            <td> ${dato.precio} </td>
            <td> ${dato.stock} </td>
            <td> <img src="${dato.imagen}" width="100"> </td>
            <td>
                <button id="btn-edit-${i}" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                    <svg xmlns="http://www.w3.org/2000/svg"        width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                             </svg>
                </button>
                ${nameUser.textContent === "vendedor" ? "" : `
                <button id="btn-delete-${i}" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                                </svg>
                </button>`}
            </td>
        `;
        tablePro.appendChild(row);
    });
}

// Función para limpiar la tabla
let clearDataTable = () => {
    while (tablePro.rows.length > 0) {
        tablePro.deleteRow(0);
    }
};

// Función para buscar productos en la tabla
let searchProductTable = () => {
    // Obtener los productos almacenados en localStorage
    let products = JSON.parse(localStorage.getItem("datosTabla")) || [];
    
    // Obtener el valor del campo de búsqueda y convertirlo a minúsculas
    let textSearch = searchInput.value.toLowerCase();

    // Filtrar los productos que contienen el texto de búsqueda
    let filteredProducts = products.filter(product =>
        product.nombre.toLowerCase().includes(textSearch)
    );

    // Mostrar los productos filtrados en la tabla
    displayProducts(filteredProducts);
}

// Función para editar algún producto de la tabla
let editDataTable = (pos) => {
    let products = JSON.parse(localStorage.getItem("datosTabla")) || [];
    let singleProduct = products[pos];
    localStorage.setItem("productEdit", JSON.stringify(singleProduct));
    localStorage.removeItem("datosTabla");
    location.href = "crear-pro.html";
}

// Función para eliminar algún producto de la tabla
let deleteDataTable = (pos) => {
    let products = JSON.parse(localStorage.getItem("datosTabla")) || [];
    let singleProduct = products[pos];
    let IDProduct = {
        id: singleProduct.id
    }
    let confirmar = confirm(`¿Deseas eliminar ${singleProduct.nombre}?`);
    if (confirmar) {
        sendDeleteProduct(IDProduct);
    }
}

// Función para realizar la petición de eliminar un producto
let sendDeleteProduct = async (id) => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(id)
        });
        if (respuesta.status == 406) {
            alert("El ID enviado no fue admitido");
        } else {
            let mensaje = await respuesta.json();
            alert(mensaje.message);
            location.reload();
        }
    } catch (error) {
        console.log(error);
    }
}



