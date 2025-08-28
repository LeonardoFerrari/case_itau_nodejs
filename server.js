require('dotenv').config();

const express = require('express');
const config = require('./app/config/init');
const rateConf = require('./app/config/rate.conf');
const exHandler = require('./app/exceptions/exceptions');
const clienteRoutes = require('./app/routes/cliente.routes');

const startServer = async () => {
    const app = express();
    await require('./app/database/init').initDb();

    app.use(rateConf);
    app.use(express.json());
    app.get('/', (req, res) => res.send('API de Clientes - case itau nodejs'));
    app.use('/clientes', clienteRoutes);
    app.use(exHandler);

    app.listen(config.app.port, () => {
        console.log(`Server running on port ${config.app.port} in ${config.app.env} mode.`);
    });

    return app;
}


startServer()
    .catch(err => {
    console.error("Failed to start the server:", err);
});