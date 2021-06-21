const moment = require('moment');

function formatMessage(username, text) {
    return {
        username, 
        text,
        time: moment().format('h:mm a') //using moment.js we format this time
    }
}

module.exports = formatMessage;