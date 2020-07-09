let socket = io()

socket.on("connect", ()=>{
    console.log("connected!");

    socket.emit("newkeys");
    
});

socket.on("newkeys", (data,cb)=>{
    console.log(data);
    
})
