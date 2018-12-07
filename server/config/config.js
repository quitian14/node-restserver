//====================================
// Peurto
//====================================
process.env.PORT = process.env.PORT || 3000;


//====================================
// Entorno
//====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================================
// Vencimiento del token
//====================================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//====================================
// Seed : Semilla de autenticacion
//====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//====================================
// Base de datos
//====================================
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'authSource=admin';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLBD = urlBD;