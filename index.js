const express = require("express");
const app = express();
const products = require('./data/products')
var jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {

    if (req.originalUrl == '/token') {
        next();
    }

    if (req.headers.authorization) {
        var auth = req.headers.authorization.split(' ');
        if (auth.length > 1) {
            var token = auth[1];
            try {
                var decoded = jwt.verify(token, privateKey)
                console.log('DECODED', decoded);
                next();
            } catch (error) {
                res.status(401).json({ msg: 'Auth error!' })
            }
        }
        res.status(401)
    }
    else {
        res.status(401).json({ msg: 'Auth Error!' })
    }
})


const privateKey = 'gojira';

app.post('/token', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;


    if (email == 'ironmaiden@mail.com' && password == "123") {
        var token = jwt.sign({ email: email }, privateKey, { expiresIn: 20 });
        res.json({ token: token});
    }
    else {
        res.status(404).json({ msg: 'user not found!' });
    }

})

app.get('/api/products', (req, res) => {
    res.json(products);
})

app.get('/api/products/:id', (req, res) => {

    let product = products.find(q => q.id == req.params.id);
    res.json(product);
})


app.listen(3000, () => {
    console.log('Server is runnig...');
})



