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
    socket.emit('welcome', message, (error)=>{
        if(error){
            return console.log(error);
        }
        console.log('message delivered...');
    });
})

document.querySelector('#send-location').addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    // asynchronus function but it doesn't support promises
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);

        const location ={
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', location, ()=>{
            console.log("Location shared...");
        });
    })
})