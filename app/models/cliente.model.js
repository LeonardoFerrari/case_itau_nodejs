const Joi = require('joi');

const clienteSchema = Joi.object({
    nome: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
});

const transacaoSchema = Joi.object({
    valor: Joi.number().positive().required(),
});

module.exports = {
    clienteSchema,
    transacaoSchema
};