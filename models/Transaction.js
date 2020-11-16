const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const TransactionSchema = new Schema({
  
  amount: {
    type: Number,
    required:true,
    
  },
  usermail: {
    type: String,
    
    
  },
  clientname: {
    type: String,
    default:'unknown'
    
  },
  discription: {
    type: String,
    defaul:'general'
    
  },
  
  dateoftra: {
    type: Date,
    default: Date.now
  }
})

module.exports = Transaction = mongoose.model('transaction', TransactionSchema)