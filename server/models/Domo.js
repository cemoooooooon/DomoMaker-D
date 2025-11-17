const mongoose = require('mongoose');
const _ = require('underscore');

let DomoModel = {};

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  lifeSavings: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  lifeSavings: doc.lifeSavings,
  _id: doc._id,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: ownerId,
  };

  return DomoModel.find(search)
    .select('name age lifeSavings')
    .lean()
    .exec(callback);
};

// helper for deleting domos by id / owner
DomoSchema.statics.deleteByOwnerAndId = (ownerId, domoId) => DomoModel.deleteOne({
  _id: domoId,
  owner: ownerId,
}).exec();

DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;
