let api = "http://localhost:8080/api/v1/product";
let addProductEndpoint = "http://localhost:8080/api/v1/product/insert";
let deleteProductEndpoint = "http://localhost:8080/api/v1/product/delete";

let container = document.querySelector("#container");

// Escuchar el evento de click en el botón de enviar
document.querySelector("#submit").addEventListener("click", (event) => {
    event.preventDefault(); // Prevenir el envío del formulario
    let productName = document.querySelector("#product-name").value;
    let productPrice = document.querySelector("#product-price").value;

    addProduct(productName, productPrice);
});

// Función para añadir el producto usando la API
function addProduct(name, price) {
    fetch(addProductEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productName: name,
            productPrice: price
        }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        return response.json();
    })
    .then((data) => {
        console.log('Producto agregado:', data);
        container.appendChild(productCard(data)); // Añadir el nuevo producto al contenedor
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Función para obtener los productos de la API
function getProducts() {
    fetch(api)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Error en la respuesta");
        }
        return response.json();
    })
    .then((data) => {
        container.innerHTML = ''; // Limpiar el contenedor antes de agregar las cartas
        data.forEach(producto => {
            container.appendChild(productCard(producto));
        });
    })
    .catch((error) => {
        console.error('Error al obtener productos:', error);
    });
}

// Función para crear la carta del producto
function productCard(p) {
    let card = document.createElement("div");
    card.className = "product card";
    card.style.width = "18rem";
    card.id = `product-${p.id}`; // Añadir un ID único para la tarjeta de cada producto

    // Título / nombre del producto
    let titulo = document.createElement("h5");
    titulo.className = "card-title";
    titulo.textContent = p.productName;

    // Precio del producto
    let precio = document.createElement("p");
    precio.className = "card-text";
    precio.textContent = `$${p.productPrice}`;

    // Botón de eliminar
    let deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger";
    deleteButton.textContent = "Eliminar";
    deleteButton.onclick = () => deleteProduct(p.id);

    card.appendChild(titulo);
    card.appendChild(precio);
    card.appendChild(deleteButton);

    return card;
}

// Función para eliminar un producto de la API
function deleteProduct(productId) {
    console.log(`Intentando eliminar el producto con id: ${productId}`);
    fetch(`${deleteProductEndpoint}/${productId}`, {
        method: 'DELETE',
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        console.log('Producto eliminado:', productId);
        let productCard = document.querySelector(`#product-${productId}`);
        if (productCard) {
            productCard.remove();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


// Cargar los productos al cargar la página
window.onload = getProducts;
