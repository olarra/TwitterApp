//mongodb
var follower = require('./controller.twitter.js');

module.exports = function (app) {


  app.post('/setMe/:username',follower.setMe);
  app.post('/setNetwork/:username',follower.setNetwork);
  app.get('/setRelationship',follower.setRelationship);

  app.get('/getMe', follower.getMe);
  app.get('/getNetwork',follower.getNetwork);
  app.get('/getRelationship',follower.getRelationship);

      // Carga una vista HTML simple donde irá nuestra Single App Page
      // Angular Manejará el Frontend
    	app.get('*', function(req, res) {
    	res.sendfile('./angular/index.html'); // Carga única de la vista
    });
};
