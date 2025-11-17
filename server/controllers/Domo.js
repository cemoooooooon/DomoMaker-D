const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.lifeSavings) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    lifeSavings: req.body.lifeSavings,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();

    const domos = await Domo.findByOwner(req.session.account._id);
    return res.status(201).json({ domos });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }
    return res.status(500).json({ error: 'An error occurred creating domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const domos = await Domo.findByOwner(req.session.account._id);
    return res.json({ domos });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const deleteDomo = async (req, res) => {
  try {
    const { id } = req.body;

    await Domo.deleteOne({
      _id: id,
      owner: req.session.account._id,
    });

    return res.json({ deleted: true });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
