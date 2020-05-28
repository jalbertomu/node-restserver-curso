//====================
// Puerto
//====================
process.env.PORT = process.env.PORT || 3000

//Rnyotno

/*process.env.NODE_ENV es una variable que declaramos en heroku, es decir, que cuando se arranque
la app en heroku esa variable estará cargada, pero en local no estará cargada, por lo tanto la tomara de aqui
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
// Vencimiento del token
//====================

process.env.CADUCIDAD_TOKEN = '48h';

//====================
// Seed de autenticancion
//====================

/*process.env.SEED es una variable que declaramos en heroku, es decir, que cuando se arranque
la app en heroku esa variable estará cargada, pero en local no estará cargada, por lo tanto la tomara de aqui
 */
process.env.SEED = process.env.SEED || 'seed-desarollo'

/*para ver las variables de entorno, tenemos lanzamos: heroku config*/
/* para declarar una nueva: heroku config:set SEED="seed-produccion" */

//Base de datos

let urlDB;



if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;