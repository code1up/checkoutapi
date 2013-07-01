// Express
var express = require("express");
var app = express();

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.static(__dirname + "/www"));
});

// Tesco
var tesco = require("./tesco");
var api = tesco.createApi("mXbIDuofamT2kU5xnVlp", "9E93CFAFAF1042D26C95");

app.post("/login", function(req, res) {
	var params = req.body;

	var email = params.email;
	var password = params.password;

	res.statusCode = 200;

	api.login(email, password, function(error, session) {
		res.json({
			sessionKey: session.sessionKey
		});
	});
});

app.get("/products/:barcode", function(req, res) {
	res.statusCode = 200;

	var sessionKey = req.query.sessionKey;
	var barcode = req.params.barcode;

	api.findProductByBarcode(sessionKey, barcode, function(error, product) {
		res.json(error || product);
	});
});

app.listen(process.env.PORT || 3000);
