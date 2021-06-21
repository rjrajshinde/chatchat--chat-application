const users = [];

//join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };
    users.push(user);
    return user;
}

//to get the information about the current user who join the chat
function getCurrentUser(id) {
    return users.find( user => user.id === id)
}

//when user leaves then it delete the user from specific room users array
function userLeave(id) {
    const index = users.findIndex(user =>  user.id === id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

//to get the user that are joined in room
function getRoomUser(room) {
    return users.filter(user => user.room === room);
}

module.exports = { userJoin, getCurrentUser , getRoomUser, userLeave };