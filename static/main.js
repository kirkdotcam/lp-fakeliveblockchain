let socket = io();
let userInfo = {
    "public":"",
    "private":""
};

socket.on("connect", ()=>{
    console.log("connected!");

    // request new keys on connection
    socket.emit("newkeys");
    
});

socket.on("newkeys", (data,cb)=>{
    // console.log(data);
    Object.assign(userInfo,data);
    console.log(userInfo);
    
    updateKeys();

});

function sendmessage(msg){
    // sends message to the chain
    console.log("pop")
};

function updateKeys(){
    // updates visible keys on page
    document.getElementById("userpublic").textContent = userInfo.public;
    document.getElementById("userprivate").textContent = userInfo.private;
};