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
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});



// autoscroll function
const autoscroll = () =>{
    const $newMessage = $messages.lastElementChild; // new message ekement

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;
    
    // visible height
    const visibleHeight = $messages.offsetHeight;

    // height of messages container
    const containerHeight = $messages.scrollHeight;

    // how far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop =$messages.scrollHeight
    }
}

socket.on('welcomeMessage', (message)=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username? message.username : 'Admin',
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', (url)=>{
    console.log(url);
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format("h:mm a")
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('replyMessage', (reply)=>{
    console.log(reply);
})

socket.on('roomData', ({room, users})=>{
   const html = Mustache.render(sidebarTemplate, {
       room,
       users
   })

   document.querySelector("#sidebar").innerHTML = html;
   autoscroll();
})




// Event management

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

socket.emit('join', {username, room}, (error)=>{

    if(error){
        alert(error)
        location.href = '/';
    }
})