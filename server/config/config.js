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
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.CADUCIDAD_TOKEN = '48h';


//====================================
// Seed : Semilla de autenticacion
//====================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//====================================
// Base de datos
//====================================
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://root:CtUKrhE2ZiZq@35.238.157.141:27017/cafe?authSource=admin';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLBD = urlBD;


//====================================
// Google client
//====================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '330877960590-6fgk4rfdbi2mi3rs8cq8s5v30ifklqno.apps.googleusercontent.com';