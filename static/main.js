let socket = io();
let userInfo = {
    "public": "",
    "private": "",
    "username": "Anonymous"
};

socket.on("connect", () => {
    console.log("connected!");

    // request new keys on connection
    newKeys();

});

socket.on("disconnect", userInfo)

socket.on("newkeys", (data, cb) => {
    // console.log(data);
    Object.assign(userInfo, data);
    updateKeys();

});

socket.on("decryptedSuccess", (data) => {
    renderDecryptedMessage(data.message);
})

socket.on("decryptedFailure", () => {
    alert("decryption Failed");
})

socket.on("newmessage", (data) => {
    // console.log("new message:", data);
    renderMessages(data);
});

socket.on("messageError", () => {
    renderServerMessage("error on message send")
})

document.addEventListener("keypress", (e) => (e.keyCode === 13) ? sendmessage() : null)

function sendmessage(msg, to) {
    // sends message to the chain
    msg = msg ? msg : document.getElementById("messageText").value;
    to = to ? to : document.getElementById("messageTo").value;

    if (!msg) alert("need a message!");
    if (!to) alert("who am I sending this to?");

    let payload = {
        msg,
        to,
        from: userInfo.public
    }

    socket.emit("message", payload);
};

function updateKeys() {
    // updates visible keys on page
    document.getElementById("userpublic").textContent = userInfo.public;
    document.getElementById("userprivate").textContent = userInfo.private;

};

function newKeys() {
    socket.emit("newkeys")
}

function renderMessages({ message, to }) {
    let classStyle = to === userInfo.public ? "userMessage" : "otherMessage";

    let recLi = document.createElement("li");
    recLi.className = classStyle;
    recLi.innerHTML = `Recipient:${to}`;

    let msgLi = document.createElement("li");
    msgLi.className = classStyle;
    msgLi.innerHTML = `Message:${message}`;
    
    let node = document.getElementById("chat");
    node.append(recLi);
    node.append(msgLi)
    
    msgLi.scrollIntoView({block:"end"});
}

function renderServerMessage(message) {
    let node = document.getElementById("serverMessage-panel");
    let p = document.createElement("p");
    p.innerHTML = `${message}`;
    node.prepend(p);
}

function renderDecryptedMessage(message) {
    let node = document.getElementById("decryptedMessage-panel");
    let p = document.createElement("p");
    p.innerHTML = `${message}`;
    node.append(p);
}

function decrypt() {
    let msg = document.getElementById("toDecrypt").value;

    socket.emit("decrypt", {
        msg,
        private: userInfo.private
    });

}