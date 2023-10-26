const userSchema = require('./schemas/userSchema');

require('dotenv').config()

const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    session = require("cookie-session"),
    bodyParser = require('body-parser'),
    ejs = require('ejs'),
    url = require('url');

const port = process.env.PORT || 9000;

app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register/', async (req, res) => {
    var user = userSchema({
        email: req.body.email,
        password: req.body.password,
    });
    await user.save()
    res.redirect('/login/{"email":"' + req.body.email + '", "password":"' + req.body.password + '"}');
});

app.get('/login/:email', async (req, res) => {
    try {
        console.log(req.params.email)
        var email = JSON.parse(req.params.email);
        console.log(email)
        var user;
        try {
            user = await userSchema.find(email)
        } catch (err) {
            console.log(err)
        }
        console.log(user)
        res.send(user);
    } catch (err) {
        console.log(err)
        res.send(err)
    }
});


mongoose.set("strictQuery", false)

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Mongo DB")
})
app.listen(port, () => {
    console.log(`TS Encryptid listening at http://localhost:${port}`)
});