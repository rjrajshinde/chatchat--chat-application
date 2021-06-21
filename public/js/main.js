// for Client side messages
//here we are going to catch all the message that emits from the server

//form on the chat.html[the last form from where we are sending the message]
const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector(".chat-messages");
const roomNameOnSideBar = document.getElementById('room-name');
const userListOnSideBar = document.getElementById('users');

//get username and room name from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

//join chatroom
socket.emit('joinRoom', { username, room });

//get room and users info to show on side bar
socket.on('roomUsers', ({room , users}) => {
    //fucntion using dom to show them on side bar
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message', message => {
    console.log(message);
    //function for display the message on chat box
    outputMessage(message);

    //for scrolling down when we entered messages
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

//event for getting the message from textbox where we are sending the message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //getting the input/value/message_text from textbox id='msg' from chat.html
    const msg = e.target.elements.msg.value;
    // console.log(msg); //print on the client side console means browser console
    //emiting the message from the user to server to display on chat
    socket.emit('chatMessage', msg);

    //it clears the textbox when we send the message
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


//dom manipulation for room and user info to show on sidebar
function outputRoomName(room) {
    roomNameOnSideBar.innerHTML = room;
}
function outputUsers(users) {
    userListOnSideBar.innerHTML = `
     ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}