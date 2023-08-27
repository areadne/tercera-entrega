const socket = io();

let input = document.getElementById("casilla");
let chatText = document.getElementById("chat-text");

input.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    const textoIngresado = event.target.value;
    console.log("Texto ingresado:", textoIngresado);
    socket.emit("message", textoIngresado);
  }
});

socket.on("historial", (data) => {
  let texto = "";

  console.log(data);
  try {
    data.forEach((element) => {
      texto += `${element.user} dice: ${element.message}<br />`;
    });

    chatText.innerHTML += texto;
    input.value = "";
  } catch (err) {
    console.log(err);
  }
});