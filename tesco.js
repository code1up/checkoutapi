var qs = require("qs");
var request = require("request");
var _ = require("underscore");
var util = require("util");

var ENDPOINT = "https://secure.techfortesco.com/groceryapi_b1/restservice.aspx";

var LOGIN_COMMAND = "LOGIN";
var PRODUCT_SEARCH_COMMAND = "PRODUCTSEARCH";

var Tesco = function(developerKey, applicationKey) {
	this.developerKey = developerKey;
	this.applicationKey = applicationKey;
};

Tesco.prototype.handleError = function(error, response, next) {
	var nextError = null;

	if (error) {
		console.dir(error);

		nextError = {
			errorCode: -1,
			narrative: "An unexpected error occurred."
		};
	}

	if (response && response.statusCode) {
		if (response.statusCode !== 200) {
			console.dir(response);

			nextError = {
				errorCode: response.statusCode,
				narrative: util.format(
					"HTTP request failed with status code %d.", response.statusCode)
			};
		}
	} else {
		nextError = {
			errorCode: -2,
			narrative: "An unexpected error occurred, no further details."
		};		
	}

	next(nextError);
};

Tesco.prototype.login = function(email, password, next) {
	var self = this;

	var options = {
		url: ENDPOINT,
		qs: {
			command: LOGIN_COMMAND,
			developerKey: this.developerKey,
			applicationKey: this.applicationKey,
			email: email,
			password: password
		},
		json: true
	};

	request.get(options, function(error, response, body) {
		self.handleError(error, response, function(nextError) {
			var session = null;

			if (nextError) {
				console.dir(nextError);

			} else {
				var json = response.body;

				console.dir(json);

				session = {
					sessionKey: json.SessionKey
				};
			}

			next(nextError, session);
		});
	});
};

Tesco.prototype.findProductByBarcode = function(sessionKey, barcode, next) {
	var self = this;

	var options = {
		url: ENDPOINT,
		qs: {
			command: PRODUCT_SEARCH_COMMAND,
			developerKey: this.developerKey,
			applicationKey: this.applicationKey,
			sessionKey: sessionKey,
			searchText: barcode
		},
		json: true
	};

	request.get(options, function(error, response, body) {
		self.handleError(error, response, function(nextError) {
			var product = null;

			if (nextError) {
				console.dir(nextError);

			} else {
				var json = response.body;

				if (_.has(json, "StatusCode") &&
					json.StatusCode === 0 &&
					_.has(json, "Products") &&
					json.Products.length) {

					var tescoProduct = _.first(json.Products);

					console.dir(tescoProduct);
					
					product = {
						eanbarcode: tescoProduct.EANBarcode,
						name: tescoProduct.Name,
						price: tescoProduct.Price,
						imageUrl: tescoProduct.ImagePath
					};

				} else {
					var statusCode = json.StatusCode || -3;
					var narrative = json.StatusInfo || "no further details";

					console.dir(json);

					nextError = {
						errorCode: -3,
						narrative: util.format(
							"Request failed with status code %d: %s.", statusCode, narrative)
					};
				}
			}

			next(nextError, product);
		});
	});
};

exports.createApi = function(developerKey, applicationKey) {
	return new Tesco(developerKey, applicationKey);
};
