'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var BookSchema = new mongoose.Schema({
    title: {type:String, required:true},
    author: {type:String, required:true},
    isbn: {type:String, required:true},
    age_range: String,
    cdu : String ,
    editorial: {type:String, required:true},
    publish_year: Number,
    synopsis: String,
    language: String,
    pages: Number,
    rating: Number,
    active: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now},
    updated_at: Date
});

export default mongoose.model('Book', BookSchema);
