const express = require('express');
const router = express.Router();
const ChargingStation = require('../models/ChargingStation');

// Create a new charging station
router.post('/', async (req, res) => {
  try {
    const { name, location, status, powerOutput, connectorType } = req.body;
    const newStation = new ChargingStation({ name, location, status, powerOutput, connectorType });
    await newStation.save();
    res.status(201).json(newStation);
  } catch (err) {
    console.error('Create charging station error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all charging stations
router.get('/', async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.json(stations);
  } catch (err) {
    console.error('Get charging stations error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a charging station by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedStation = await ChargingStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStation) return res.status(404).json({ message: 'Charging station not found' });
    res.json(updatedStation);
  } catch (err) {
    console.error('Update charging station error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a charging station by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedStation = await ChargingStation.findByIdAndDelete(req.params.id);
    if (!deletedStation) return res.status(404).json({ message: 'Charging station not found' });
    res.status(204).send();
  } catch (err) {
    console.error('Delete charging station error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
