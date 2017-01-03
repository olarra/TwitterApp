//controllers/index.js
var twitterAPI = require('../config/twitter.js');
var Followers = require('./model.follower');
var MyInfo = require('./model.myinfo');
var Relationship = require('./model.relationship');

exports.setMe= function(req, res, next) {
	post_name = req.params.username;
	MyInfo.remove().exec();
	twitterAPI.get('/users/show', {screen_name: post_name},
	function(error, me, response) {
		if (!error) {
			MyInfo.create({name: me.name, photo: me.profile_image_url, location: me.location, followers: me.followers_count ,friends: me.friends_count },
				function(err, me) {
				if (err)
					res.send(err);
				// Obtine y devuelve todas las personas tras crear una de ellas
				MyInfo.find(function(err, me) {
				 	if (err)
				 		res.send(err)
				 	res.json(me);
				});
			});
			//return next();
		} else {if(error[0].message == "User not found."){res.send("INVALID")}}
	});
}


exports.getMe = function (req,res,next){
	MyInfo.find(
		function(err, me) {
			if (err)
				res.send(err)
					res.json(me); // devuelve todas las Personas en JSON
				}
			);
}

/*********************************************************************************************/
exports.getNetwork = function (req,res,next){
	Followers.find(
		function(err, followers) {
			if (err)
				res.send(err)
					res.json(followers); // devuelve todas las Personas en JSON
				}
			);
}


/*********************************************************************************************/
exports.setNetwork = function(req, res, next) {
var myjsonArray = [];
var count = 1;
var num = 1;
post_name = req.params.username;
console.log(post_name);
Followers.remove().exec();

	twitterAPI.get('followers/list', { screen_name: post_name  ,skip_status: true, count:200},  function getData(error, myfollowers, response) {

if (!error) {

		mycursor = myfollowers.next_cursor;
		var jsonMyFollowers = myfollowers.users;

		//I get one page
		for (var i = 0; i < jsonMyFollowers.length; i++)
		{
			myjsonArray.push({
				no : num,
				description : jsonMyFollowers[i].description,
				location: jsonMyFollowers[i].location,
				photo : jsonMyFollowers[i].profile_image_url,
				name: jsonMyFollowers[i].name,
				display_name : jsonMyFollowers[i].screen_name,
				id : jsonMyFollowers[i].id_str
		})
				num++;
		}

		}
else {
	console.log(error);
}
		count++;
	  if(myfollowers.next_cursor > 0 && count <15 )
		{
			twitterAPI.get('followers/list', { screen_name: post_name, cursor: myfollowers.next_cursor ,skip_status: true, count:200}, getData);
		}
		else{
			var result;
			var events = {};
			setTimeout(function(){
				creation = true;
				Followers.create({mainUser: post_name ,follower: myjsonArray});
				if (events.finish) events.finish();
			},0);
			events.finish =function(){
				setTimeout(function(){
				Followers.find(function(err, follower) {
					if (err)
						res.send(err)
					res.json(follower);
				});
			},300);
			}
			}
	});
}

//*************************************************************+
exports.setRelationship = function(req, res, next) {
	Relationship.remove().exec();
  var nodes_array = [];
	var links_array = [];
	var result;
	var events = {};
	var jsonMyFollowers;
	var i=0;
	var flag=true;

	setTimeout(function(){
		Followers.find(function(err, followers)
		{
			if (!err)
			{
				 if(followers.length!=0)
				 {
						var myObject = (followers[0].toObject());
						jsonMyFollowers = myObject.follower;
						jsonMe = myObject.mainUser;
						if (events.finish) events.finish();
					}
					else
					{
						res.send("empty document");
					}

			}
			else{
					console.log(err);
			}
		});
	}, 0);

	events.finish =function(){

nodes_array.push({name : jsonMe, location : "location"});

		for(var p = 0; p < jsonMyFollowers.length; p++){
			links_array.push( {source : 0, target : jsonMyFollowers[p].no});
		}

		twitterAPI.get('followers/ids', { screen_name: jsonMyFollowers[i].display_name ,skip_status: true, count:5000 },  function getData(err, hisfollowers, response) {
		// Do stuff here to write data to a file
		if (!err) {
		  var jsonHisFollowers = hisfollowers.ids;
		  var hisjsonArray = [];
		      for (var j = 0; j < jsonMyFollowers.length; j++)
		      {
						if(flag) console.log(jsonMyFollowers[j].display_name); nodes_array.push({name : jsonMyFollowers[j].display_name, location : jsonMyFollowers[j].location});

		        for (var k = 0; k < jsonHisFollowers.length; k++)
		        {
		          if (jsonMyFollowers[j].id == jsonHisFollowers[k])
		          {
		            console.log(jsonMyFollowers[i].display_name  + " is being followed by " + jsonMyFollowers[j].display_name);
		            links_array.push( {source : jsonMyFollowers[i].no, target : jsonMyFollowers[j].no});
		          }
		        }
		    }
		}
		  else {
				console.log(err);
			}

		i++;
		if(i <15 && i < jsonMyFollowers.length) {flag=false; console.log("llamada " + i + " a l'API" );  setTimeout(function(){twitterAPI.get('followers/ids', { screen_name: jsonMyFollowers[i].display_name ,skip_status: true, count:5000}, getData)}, 0);
	}else{


			Relationship.create({nodes: nodes_array, links: links_array});


		setTimeout(function(){
			Relationship.find(function(err, relationship) {
				if (err)
					res.send(err)
				res.json(relationship);
			});
		}, 1000);
		}
	});
	//fin api
	}
}
/*********************************************************************************************/
exports.getRelationship = function (req,res,next){
	Relationship.find(function(err, relationship) {
		if (err)
			res.send(err)
		res.json(relationship);
	});
}


/*********************************************************************************************/
