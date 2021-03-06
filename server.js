/**
* Dependencia de modulos
*/
var express = require('express');
var ejs = require('ejs');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var app = express();
var morgan = require('morgan');
/**
* Configuración.
*/

app.configure(function(){
//Indicar puerto del servidor
app.set('port',3700);
//Localización de ficheros estaticos
app.use(express.static(__dirname + '/angular'));
//Recuperación de parametros mediante el url//Middle-ware configiration
app.use(express.json());
app.use(express.urlencoded());
//Vizualisacion de los logs en la consola
app.use(morgan('dev'));
// Simula DELETE y PUT
app.use(express.methodOverride());
});

/**
* Rutas.
*/
var paths = require('./app/routes.twitter')(app);
var dbName = 'twitter';

//local database connection
mongoose.connect('mongodb://localhost:27017/'+ dbName ,function(err,res){
  if(err)
       console.log("Error connecting to the Database. " + err);
  else
       console.log("Connected to the Database : " + dbName);
          app.listen(app.get('port'),function(){
          console.log("server running on port: " + app.get('port'));
   });
});
