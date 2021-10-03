const socket = io();

// Elements
const $messageForm = document.querySelector("#welcome-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on('welcomeMessage', (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        message: message
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('locationMessage', (url)=>{
    console.log(url);
    const html = Mustache.render(locationTemplate, {
        url: url
    });
    $messages.insertAdjacentHTML('beforeend', html);
})

socket.on('replyMessage', (reply)=>{
    console.log(reply);
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = document.querySelector('input').value;
    // if you want to access different input tags it is better to use below method
    // const message = e.target.elements.message;
    socket.emit('welcome', message, (error)=>{

        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();
        if(error){
            return console.log(error);
        }
        console.log('message delivered...');
    });
})

$sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    // asynchronus function but it doesn't support promises
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position);

        const location ={
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
        socket.emit('sendLocation', location, ()=>{
            console.log("Location shared...");
            $sendLocationButton.removeAttribute('disabled');
        });
    })
})