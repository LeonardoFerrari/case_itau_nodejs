const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

router.get('/', clienteController.GetAllAsync);
router.get('/:id', clienteController.GetByIdAsync);

router.put('/:id', clienteController.UpdateAsync);
router.delete('/:id', clienteController.DeleteByIdAsync);

router.post('/', clienteController.CreateAsync);
router.post('/:id/depositar', clienteController.DepositarAsync);
router.post('/:id/sacar', clienteController.SacarAsync);

module.exports = router;