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

socket.on("disconnect",userInfo)

socket.on("newkeys", (data, cb) => {
    // console.log(data);
    Object.assign(userInfo, data);
    updateKeys();

});

socket.on("decryptedSuccess")

socket.on("decryptedFailure")

socket.on("newmessage",(data)=>{
    console.log("new message:", data)
});

socket.on("messageError", ()=>{
    // alert("YA BLEW IT!")
})

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

    socket.emit("message",payload);
};

function updateKeys() {
    // updates visible keys on page
    document.getElementById("userpublic").textContent = userInfo.public;
    document.getElementById("userprivate").textContent = userInfo.private;

};

function newKeys() {
    socket.emit("newkeys")
}

function renderMessages() {

}

function decrypt() {
    socket.emit("decrypt")
}