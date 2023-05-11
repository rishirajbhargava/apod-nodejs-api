const express = require('express');
const path = require('path');
const exphbs= require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars');
const cookieParser =require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
require("dotenv").config();
const connectDb = require('./config/database');
const port = process.env.PORT || 5000;
const { getImage , getLogin, getRegister, login,register, logout} = require('./controllers.js')
const  {isAuthenticated , initializingPassport}  = require('./config/passportConfig');


connectDb();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(session({secret: 'secret', resave: false, saveUninitialized: false}))
app.use(cookieParser('secret'));


//pasport middleware
initializingPassport(passport);
app.use(passport.initialize());
app.use(passport.session());




app.use(express.static(path.join(__dirname,'public')));

app.engine('handlebars', exphbs.engine({handlebars: allowInsecurePrototypeAccess(Handlebars),defaultLayout: 'home'}));
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get('/register',getRegister)
app.post('/register', register);

app.get('/login',getLogin);
app.get('/logout', logout);





app.post('/login',passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    failureMessage: "Invalid username or password"

}),login);

app.get('/', isAuthenticated , getImage);



app.listen(port, () => console.log(`Server running, listening on port ${port}!`))