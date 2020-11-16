const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
//var dishRouter = require('./dishRouter');
//const Dishes = require('./models/dishes');



const User = require('../models/User')
const Transaction=require('../models/Transaction');
users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
  const today = new Date()
  const userData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    created: today
  }

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          userData.password = hash
          User.create(userData)
            .then(user => {
              res.json({ status: user.email + 'Registered!' })
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        })
      } else {
        res.json({ error: 'User already exists' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.post('/login', (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Passwords match
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send(token)
        } else {
          // Passwords don't match
          res.json({ error: 'User does not exist' })
        }
      } else {
        res.json({ error: 'User does not exist' })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

users.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  User.findOne({
    _id: decoded._id
  })
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('User does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
} )


users.post('/transaction', (req, res) => {


    const today = new Date()
    const transactiondata = {
      amount: req.body.amount,
      dateoftra: today,
      usermail:req.body.usermail,
      discription:req.body.discription,
      clientname:req.body.clientname,
    }
  
    Transaction.create(transactiondata)
              .then(trancsaction => {
                res.json({ status:  'Inserted' })
              })
              .catch(err => {
                res.send('error: '+err);
              })
     
      
  })

  users.post('/report', (req, res) => {


    
    const transactiondata = {
     
      usermail:req.body.usermail,
     
    }
  
    Transaction.find(transactiondata)
              .then(trancsaction => {
                res.json(trancsaction)
              })
              .catch(err => {
                res.send('error: '+err);
              })
     
      
  })

  users.delete('/delete/byid', (req, res) => {

    Transaction.findByIdAndDelete({_id:req.body.userid})
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.send('error in user.js: ' + err)
    })})

    users.post('/delete/byid', (req, res) => {

      Transaction.findByIdAndDelete({_id:req.body.userid})
      .then(user => {
        res.json(user)
      })
      .catch(err => {
        res.send('error in user.js: ' + err)
      })

   /* Transaction.findByIdAndDelete({_id:req.body.userid})
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      res.send('error in user.js: ' + err)
    })*/
})
    
      
  


  
  
  /*users.delete('/users/:id', (req, res) => {
    
  
    Transaction.findByIdAndDelete({_id:req.params.id})
      .then(user => {
        if (user) {
          res.json(user)
        } else {
          res.send('Transaction does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })

  
  */
 users.post('/deleteclient', (req, res) => {
    
  
  Transaction.deleteMany({usermail:req.body.usermail,clientname:req.body.clientname})
    .then(user => {
      if (user) {
        res.json(user)
      } else {
        res.send('Transaction does not exist')
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

  users.get('/report', (req, res) => {
    
  
    Transaction.find({usermail:req.body.usermail})
      .then(user => {
        if (user) {
          res.json(user)
        } else {
          res.send('Transaction does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })
  users.post('/reportanalysis', (req, res) => {
    
  
    Transaction.aggregate([{$match:{usermail:req.body.usermail}},{$group:{_id:"$clientname",count:{$sum:1},sumvalue:{$sum:"$amount"}}}])
      .then(user => {
        if (user) {
          res.json(user)
        } else {
          res.send('Transaction does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })
  
  users.get('/report/:id', (req, res) => {
    
  Transaction.find({usermail:req.params.id})
  
    
      .then(user => {
        if (user) {
          res.json(user)
        } else {
          res.send('Transaction does not exist')
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })

  users.get('/report/:um/:cn', (req, res) => {
    if(req.params.cn =="findsum"){
      Transaction.aggregate([{$match:{usermail:req.params.um}},{$group:{_id:null,count:{$sum:"$amount"}}}])
      .then(user => {
       res.json(user)
      })
      .catch(err => {
        res.send('error: ' + err)
      })}
      else if(req.params.cn =="findcount"){
        Transaction.aggregate([{$match:{usermail:req.params.um}},{$group:{_id:null,count:{$sum:1}}}])
      .then(user => {
       res.json(user)
      })
      .catch(err => {
        res.send('error: ' + err)
      })
      }

    else{
   Transaction.find({usermail:req.params.um ,clientname:req.params.cn})
    
      
        .then(user => {
          if (user) {
            res.json(user)
          } else {
            res.send('Transaction does not exist')
          }
        })
        .catch(err => {
          res.send('error: ' + err)
        })
      }
    })
  
    users.get('/report/:um/:cl/:cn', (req, res) => {

      if(req.params.cn =="findsum"){
        Transaction.aggregate([{$match:{usermail:req.params.um , clientname:req.params.cl }},{$group:{_id:null,count:{$sum:"$amount"}}}])
        .then(user => {
         res.json(user)
        })
        .catch(err => {
          res.send('error: ' + err)
        })}
       else if(req.params.cn =="findcount"){
          Transaction.aggregate([{$match:{usermail:req.params.um , clientname:req.params.cl }},{$group:{_id:null,count:{$sum:1}}}])
          .then(user => {
           res.json(user)
          })
          .catch(err => {
            res.send('error: ' + err)
          })}
  


    })
    
  
      
    
   
module.exports = users