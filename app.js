var app = require('express')();
var mongoose =  require('mongoose');

mongoose.connect(process.env.DATABASE_URL);

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log("We're connected!!");
});

var kittySchema = mongoose.Schema({
    name: String
});

var Kitten = mongoose.model('Kitten', kittySchema);

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/add_kitten', function(req, res) {
    //access post data, get the value for field "name", save it as a kitten, send 201 HTTP

    var name = req.body.name;
    console.log(name);
    var newKitten = new Kitten({
        name: name
    });
    newKitten.save(function(err) {
        if(err) {
            res.status(400).send();
        }
        else    {
            res.status(201).send(newKitten);
        }
    });
});

var user = mongoose.Schema({
    firstName:String,
    lastName:String,
    username:String,
    emailId:String,
    password:String
});

var UserModel = mongoose.model('User', user);

app.post('/register', function (req, res, next) {
    var user = new UserModel ({
        firstName: req.body.first_name,
        lastName: req.body.last_name,
        username: req.body.username,
        emailId: req.body.email,
        password: req.body.password
    });

    user.save(function(err) {
        if(err) {
            return res.status(400).send();
        }
        else{
            return res.status(201).send();
        }
        return res.send('Logged In!');
    });
});

app.post('/login', function (req, res, next) {
    var email = req.body.email;
    var pass = req.body.pass;

    User.findOne({Email: email, Pass: pass}, function(err, user) {
        if(err) return next(err);
        if(!user) return res.send('Not logged in!');
        req.session.user = email;
        return res.send('Logged In!');
    });
});

app.get('/logout', function (req, res) {
    req.session.user = null;
});

/*var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));*/

// username, password, database name - remove from string and include from env parameters.
// /user -> post with fields username, email_id, password, first_name, last_name -> create user, save user. md5 hash password
// /login -> post username, password -> check if user with username exists, if yes, check password, HTTp 200 if password is correct, else 403, set cookie/session
// /home -> return list of kittens if logged iin or send 403

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

//app.use(express.static('static'));