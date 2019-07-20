const express = require('express');
const app = express();
//AuthRoute
app.use(require('./auth/auth.route'))
//MatchRoute
app.use(require('./match/match.route'))
app.use(require('./match/scores.route'))
//NewsRoute
app.use(require('./news/news.route'))
//TeamRoute
app.use(require('./team/team.route'))
//TournamentRoutes
app.use(require('./tournament/tournament.route'))
app.use(require('./tournament/stats.route'))
app.use(require('./tournament/finish.route'))
//UserRoute
app.use(require('./user/user.route'))

module.exports = app