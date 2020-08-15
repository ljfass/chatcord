const moment = require('moment');
function messages(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  }
}

module.exports = messages;