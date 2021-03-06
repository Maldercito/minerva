/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/loans              ->  index
 * POST    /api/loans              ->  create
 * GET     /api/loans/:id          ->  show
 * PUT     /api/loans/:id          ->  update
 * DELETE  /api/loans/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Loan from './loan.model';
import Book from '../book/book.model.js';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Loans
export function index(req, res) {
  Loan.find()
    .populate('user')
    .populate('book')
    .populate('borrower')
    .populate('incidents')
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Loan from the DB
export function show(req, res) {
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Loan in the DB
export function create(req, res) {
  Loan.create(req.body)
    .then(function(loan){
        Book.findByIdAndUpdate(
                loan.book,
                { $push: { loans: loan._id } },
                { safe: true, upsert: true },
                function(err, model) {
                    console.log(err);
                }
             );
     
        res.status(201).send(loan);
        
        })
    .catch(handleError(res));
}

// Updates an existing Loan in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Loan from the DB
export function destroy(req, res) {
  Loan.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
