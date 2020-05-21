require('dotenv').config()
let db = require('../models')
let router = require('express').Router()
let jwt = require('jsonwebtoken')

// POST /auth/login (find and validate user; send token)
router.post('/login', (req, res) => {
  console.log(req.body)
  // Look up the user by their email
  db.User.findOne({ email: req.body.email })
  .then(user => {
    // Check whether the user exists
    if (!user) {
      // If they don't have an account, send an error message
      return res.status(404).send({ message: 'User was not found!' })
    }

    // They exist, but make sure they have a correct password
    if (!user.validPassword(req.body.password)) {
      // Incorrect password, send error back
      return res.status(401).send({ message: 'Invalid credentials' })
    }

    // We have a good user - make them a new token, send it to them
    let token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 8 // 8 hours, in seconds
    })

    res.send({ token })

  })
  .catch(err => {
    console.log('Error in POST /auth/login', err)
    res.status(503).send({ message: 'Server-side or DB error' })
  })

})

router.put('/games', (req, res) => {
  console.log(req.body)
  // Look up the user by their email
  db.User.findOne({ email: req.body.email })
  .then(user => {
    console.log(req.body.gameId)
   user.games.push(req.body.gameId)
   user.save()
  })
  .catch(err => {
    console.log(err)
  })

})



// POST to /auth/signup (create user; generate token)
router.post('/signup', (req, res) => {
  console.log(req.body)
  // Make sure the user is not a duplicate
  // Look up the user by email to be sure they are new
  db.User.findOne({ email: req.body.email })
  .then(user => {
    // If the user exists already then do NOT let them create another account
    if (user) {
      // No no! Sign up instead!
      return res.status(409).send({ message: 'Email address in use'})
    }
    // We know the user is legitimately a new user: CREATE THEM!
    db.User.create(req.body)
    .then(newUser => {
      // Yay! Things worked and user exists now!
      // Create a token for the new user
      let token = jwt.sign(newUser.toJSON(), process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 8 // 8 hours, in seconds
      })

      res.send({ token })
    })
    .catch(err => {
      console.log('Error creating user', err)
      if (err.nam === 'ValidationError') {
        res.status(412).send({ message: `Validation Error ${err.message}` })
      }
      else {
        console.log('Error', err)
        res.status(500).send({ message: 'Error creating user' })
        
      }
    })
  })
  .catch(err => {
    console.log('ERROR IN POST /auth/signup')
    res.status(503).send({ message: 'Database or server error' })
  })
})



module.exports = router
