const express = require('express')
var methodOverride = require('method-override')

app = express()
	  express_session = require('express-session'),
	  bodyParser = require('body-parser'),
	  port = process.env.PORT || 8080,
	  mongoose = require('mongoose'),
	  ejs = require('ejs'),
      product = require('./app/Models/product.js'),
      session = require('express-session'),
      cookieParser = require('cookie-parser');




mongoose.Promise = global.Promise;
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'iloveyoubaobao', // session secret
    resave: false,
    saveUninitialized: true
}));
app.use(methodOverride('_method'))

var routes = require('./app/routes/route.js'); //importing route
routes(app);


app.get('/mydemo', (req, res)=>
{
	res.send('Hello World!');
});

app.listen(port,()=>
{
	console.log('listened port'+ port);
});

