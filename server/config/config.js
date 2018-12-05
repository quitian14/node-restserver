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
urlBD = 'mongodb://root:CtUKrhE2ZiZq@35.238.157.141:27017/cafe?authSource=admin';
process.env.URLBD = urlBD;