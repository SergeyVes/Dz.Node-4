const express = require('express');
const Joi = require('joi');
const path = require('path');
const fs = require('fs');

const pathJson = path.join(__dirname, 'pocket.json');

const app = express();

app.use(express.json());

let uniqID = 0;
const users = [];

const userSchema = Joi.object({
    firstName: Joi.string().min(1).required(),
    secondName: Joi.string().min(1).required(),
    age: Joi.number().min(1).max(150),
    city: Joi.string().min(1),
});

const idSchema = Joi.object({
    id: Joi.number().required(),
});

app.get('/users', (req, res) =>{
    const personsData = fs.readFileSync(pathJson, 'utf-8');
    const result = JSON.parse(personsData);
    res.send({result});
});

app.get('/users/:id', (req, res) => {
    const personsData = fs.readFileSync(pathJson, 'utf-8');
    const result = JSON.parse(personsData);
    const userId = Number(req.params.id);
    const user = result.find((user) => user.id === userId);

    if (user) {
        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
});

app.post('/users', (req,res) => {

    const userValidationResult = userSchema.validate(req.body);

    if (userValidationResult.error) {
        return res.status(404).send(userValidationResult.error.details);
    };

    console.log(req.body);
    uniqID +=1;

    users.push({
        id: uniqID,
        ...req.body
    });

    fs.writeFileSync(pathJson, JSON.stringify(users, null, 2));

    res.send({
        id: uniqID
    });
});

app.put('/users/:id', (req, res) => {
    const idValidationResult = idSchema.validate(req.params);

    if (idValidationResult.error) {
        return res.status(404).send(idValidationResult.error.details);
    };

    const userValidationResult = userSchema.validate(req.body);

    if (userValidationResult.error) {
        return res.status(404).send(userValidationResult.error.details);
    };

    const personsData = fs.readFileSync(pathJson, 'utf-8');
    const result = JSON.parse(personsData);
    const userId = Number(req.params.id);
    const user = result.find((user) => user.id === userId);

    if (user) {
        user.firstName = req.body.firstName;
        user.secondName = req.body.secondName;
        user.age = req.body.age;
        user.city = req.body.city;

        fs.writeFileSync(pathJson, JSON.stringify(result, null, 2));

        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    };
});

app.delete('/users/:id', (req, res) => {
    const idValidationResult = idSchema.validate(req.params);

    if (idValidationResult.error) {
        return res.status(404).send(idValidationResult.error.details);
    };

    const personsData = fs.readFileSync(pathJson, 'utf-8');
    const result = JSON.parse(personsData);
    const userId = Number(req.params.id);
    const user = result.find((user) => user.id === userId);

    if (user) {
        const userToDelete = result.indexOf(user);
        result.splice(userToDelete, 1);

        fs.writeFileSync(pathJson, JSON.stringify(result, null, 2));

        res.send({user});
    } else {
        res.status(404);
        res.send({user: null});
    }
});



const port = 3000;

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});