// Express
var express = require("express");
var app = express();

app.configure(function() {
	app.use(express.bodyParser());
});

// Tesco
var tesco = require("./tesco");
var api = tesco.createApi("mXbIDuofamT2kU5xnVlp", "9E93CFAFAF1042D26C95");

app.post("/login", function(req, res) {
	var credentials = req.body;

	var email = credentials.email;
	var password = credentials.password;

	res.statusCode = 200;

	api.login(email, password, function(error, response) {
		res.json({
			sessionKey: response.sessionKey
		});
	});
});

app.get("/products/:barcode", function(req, res) {
	res.statusCode = 200;

	tesco.login(email, password);

	res.json({
		hello: req.params.barcode
	});
});

app.listen(process.env.PORT || 3000);
