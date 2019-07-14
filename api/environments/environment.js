
// ====================================
// Enviroment PORT
// ====================================
process.env.WHITELIST = ['http://0.0.0.0:4200'];

// ====================================
// Enviroment PORT
// ====================================
process.env.PORT = process.env.PORT || 80;

//================================
// Vencimiento del token
// ===============================

process.env.TOKEN_EXPIRATION  = '48h';

//================================
// SEED
// ===============================

process.env.SEED = process.env.SEED || '#!QWE#$';

//================================
// SALT ROUNDS
// ===============================
process.env.SALT_ROUNDS = process.env.SALT_ROUNDS || 10;
//================================
// BD
// ===============================

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb+srv://miguelesvida:bMCyIaqgtBSTB8NU@cluster0-lpoyb.mongodb.net/test?retryWrites=true&w=majority'
} else {
    urlDB = 'mongodb+srv://miguelesvida:bMCyIaqgtBSTB8NU@cluster0-lpoyb.mongodb.net/test?retryWrites=true&w=majority';
}

process.env.URLDB = urlDB;