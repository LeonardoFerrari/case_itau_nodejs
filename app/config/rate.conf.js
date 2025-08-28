const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const express = require('express');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = [
    helmet(),
    express.json(),
    morgan('dev'),
    limiter
];