const socket = io();

socket.on('welcomeMessage', (message)=>{
    console.log(message);
})

socket.on('replyMessage', (reply)=>{
    console.log(reply);
})

document.querySelector("#welcome-form").addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = document.querySelector('input').value;
    // if you want to access different input tags it is better to use below method
    // const message = e.target.elements.message;
    socket.emit('welcome', message);
})