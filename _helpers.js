const moment = require('moment')

function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function momentFormat(a) {
  return moment(a).format('MMMM Do YYYY, h:mm:ss a');
}

module.exports = {
  ensureAuthenticated,
  getUser,
  momentFormat
};