const express = require('express')
const app = express()
const TokenGuard = require('../../guards/token.guard')
const RoleGuard = require('../../guards/role.guard')

app.get('/api/auth/menu', [TokenGuard, RoleGuard], (req, res) => {
    return res.json({
        success: true,
        message: 'User Authorized'
    })
})

app.get('/api/auth/navbar', [TokenGuard], (req, res) => {
    if (req.user.role == "ADMIN_ROLE") {
        return res.json([
            { ruta: 'Torneos', url: '/TorneosTable', icono: 'fas fa-sitemap mr-2' },
            { ruta: 'Equipos', url: '/EquiposTable', icono: 'fas fa-users' },
            { ruta: 'Jugadores', url: '/JugadoresTable', icono: 'fas fa-user' }
        ])
    } else if (req.user.role == "PLAYER_ROLE") {
        return res.json(
            [{ ruta: 'Dashboard User', url: '/DashboardTorneo', icono: 'fas fa-sitemap mr-2' }]
        )
    }
})

module.exports = app