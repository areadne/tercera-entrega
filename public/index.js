const socket = io();

const formulario = document.getElementById("formulario");
const boton = document.getElementById("boton");
const divProductosEnFront = document.getElementById("productos-en-front")
const formularioEliminar = document.getElementById("deleteForm")

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;
  const category = document.getElementById("category").value;
  const status = document.getElementById("status").value;

  let productoAgregado = { title, description, price, thumbnail, code, stock, category, status };

  socket.emit("formulario", productoAgregado);

});

formularioEliminar.addEventListener("submit", (event) => {
    event.preventDefault()

    const id = document.getElementById("idInput").value

    socket.emit("delete", id)
})

socket.on("productos", (data) => {
    const listaProducto = JSON.parse(data)

    let productosEnFront = ""

    listaProducto.reverse().forEach( (element) => {

        productosEnFront += `
        <h3>Id: ${element.internal_id}</h3>
        <h3>Titulo: ${element.title}</h3>
        <h3>Descripcion: ${element.description}</h3>
        <h3>Precio: ${element.price}</h3>
        <h3>Link: ${element.thumbnail}</h3>
        <h3>Codigo: ${element.code}</h3>
        <h3>Stock: ${element.stock}</h3>
        <h3>Categoria: ${element.category}</h3>
        <h3>Status: ${element.status}</h3>
        <hr/>
        `

        divProductosEnFront.innerHTML = productosEnFront
        
    });
})