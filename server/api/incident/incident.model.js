'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var IncidentSchema = new mongoose.Schema({
  loan: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan' },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'Borrower' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  observations: String,
  type : String,
  active : {type: Boolean , default:true},
  created_at : {type: Date, default : Date.now},
  updated_at : Date
});

export default mongoose.model('Incident', IncidentSchema);
