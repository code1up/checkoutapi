var request = require("request");
var qs = require("qs");

var ENDPOINT = "https://secure.techfortesco.com/groceryapi_b1/restservice.aspx";
var LOGIN_COMMAND = "LOGIN";

var Tesco = function(developerKey, applicationKey) {
	this.developerKey = developerKey;
	this.applicationKey = applicationKey;

	this.sessionKey = null;
};

Tesco.prototype.login = function(email, password, next) {
	var options = {
		url: ENDPOINT,
		qs: {
			command: LOGIN_COMMAND,
			developerKey: this.developerKey,
			applicationKey: this.applicationKey,
			email: email,
			password: password,
		},
		json: true
	};

	console.log(options);

	this.sessionKey = null;

	request.get(options, function(error, response, body) {
		if (error) {
			next({
				narrative: "Error"
			});

			return;
		}

		if (response.statusCode != 200) {
			next({
				narrative: "HTTP StatusCode"
			});

			return;
		}

		this.sessionKey = body.SessionKey;

		console.dir(body);

		console.log("sessionKey: %s", this.sessionKey);

		next(null, {
			sessionKey: this.sessionKey
		});
	});
};

exports.createApi = function(developerKey, applicationKey) {
	return new Tesco(developerKey, applicationKey);
};
