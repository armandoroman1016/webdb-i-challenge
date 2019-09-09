const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    db('accounts')
    .select('*')
    .then( accounts => res.status(200).json(accounts))
    .catch( err => res.status(500).json(err))
})

server.post('/', (req, res) => {
    const accountData = req.body
    if(!accountData.name || !accountData.budget){
        res.status(400).json({message: 'Please provide a budget and name for this account'})
    }else{
        db('accounts')
        .insert(accountData, 'id')
        .then(([id]) => {
            db('accounts')
            .where({ id })
            .first()
            .then( account => {
                res.status(201).json(account)
            })
            .catch( err => res.status(500).json({message: 'There was an unknown error.'}))
        })
    }
})

server.put('/:id', (req, res) => {
    const updatedData = req.body
    const id = req.params.id 
    if(!updatedData.name || !updatedData.budget){
        res.status(400).json({message: 'Please provide a budget and name for this account'})
    }else{
        db('accounts')
        .where('id', id)
        .update(updatedData)
        .then( updated => {
            if(updated){
                res.status(200).json(updated)
            }else{
                res.status(404).json({message: "We couldn't find that account in our records"})
            }
        })
        .catch( err => res.status(500).json({message: 'There has been an unexpected error.'}))
    }
})

module.exports = server;