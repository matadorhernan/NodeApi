const express = require('express');
const app = express();

//load modules here from routes

app.use(require('./auth/auth.route'))
app.use(require('./user/user.route'))
app.use(require('./team/team.route'))

module.exports = app