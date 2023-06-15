const socket = io();
let email;
let chatBox = document.getElementById("chatBox");
let identificator = document.getElementById("identificator");

Swal.fire({
  title: "Ingrese su email",
  input: "email",
  text: "Ingrese su email",
  inputValidator: (value) => {
    if (!value) {
      return "Debe ingresar un email";
    } else if (!value.includes("@") || !value.includes(".")) {
      return "Debe ingresar un email valido";
    }
  },
  allowOutsideClick: false,
}).then((result) => {
  email = result.value;
    identificator.innerHTML = `${email}`;
});

chatBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { email: email, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.reverse().forEach((message) => {    
        messages = messages + `${message.email}: ${message.message} <br>`;
    });
    log.innerHTML = messages;
});
