//====================
// Puerto
//====================
process.env.PORT = process.env.PORT || 3000

//Rnyotno

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Base de datos

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://mamunts:DVB1TuLoq8XvKJYM@cluster0-cba5d.mongodb.net/cafe?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB;