function exHandler(err, req, res, next) {
    console.error(err.stack);
    
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    res.status(statusCode).json({
        message: 'Erro: ' + err.message,
        stack: err.stack
    });
}

module.exports = exHandler;