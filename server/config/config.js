//====================================
// Peurto
//====================================
process.env.PORT = process.env.PORT || 3000;


//====================================
// Entorno
//====================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//====================================
// Base de datos
//====================================
if (process.env.NODE_ENV === 'dev') {
    urlBD = 'mongodb://localhost:27017/cafe?authSource=admin';
} else {
    urlBD = process.env.MONGO_URI;
}

process.env.URLBD = urlBD;