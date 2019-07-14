const express = require('express');
const app = express();

//load modules here from routes

app.use(require('./auth/auth.route'))
app.use(require('./match/match.route'))
app.use(require('./news/news.route'))
app.use(require('./stats/stats.route'))
app.use(require('./team/team.route'))
app.use(require('./tournament/tournament.route'))
app.use(require('./user/user.route'))

module.exports = app