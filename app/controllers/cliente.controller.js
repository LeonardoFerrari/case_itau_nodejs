const { getDb } = require('../database/init');
const UnitOfWork = require('../database/dbcontext/unit.of.work');
const { clienteSchema, transacaoSchema } = require('../models/cliente.model');

exports.GetAllAsync = async (req, res) => {
    let uow;
    try {
        uow = new UnitOfWork(getDb());
        const clientes = await uow.clientes.FindAllAsync();
        if (clientes.length === 0) {
            return res.status(404).json({ Erro: 'Nenhum cliente encontrado' });
        }
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ Erro: err.message });
    } finally {
        if (uow) await uow.DisposeAsync();
    }
};

exports.GetByIdAsync = async (req, res) => {
    let uow;
    try {
        uow = new UnitOfWork(getDb());
        const cliente = await uow.clientes.FindByIdAsync(req.params.id);
        
        if (!cliente) {
            return res.status(404).json({ Erro: 'Cliente não encontrado' });
        }
        
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ Erro: err.message });
    } finally {
        if (uow) await uow.DisposeAsync();
    }
};

exports.CreateAsync = async (req, res) => {
    let uow;
    try {
        const { error, value } = clienteSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ Erro: error.details[0].message });
        }

        uow = new UnitOfWork(getDb());
        await uow.BeginAsync();
        
        const novoCliente = await uow.clientes.CreateAsync(value);
        await uow.CommitAsync();
        
        res.status(201).json(novoCliente);
    } catch (err) {
        if (uow) await uow.RollbackAsync();
        
        if (err.message.includes('UNIQUE constraint')) {
            res.status(400).json({ Erro: 'Email já existe na base' });
        } else {
            res.status(400).json({ Erro: err.message });
        }
    } finally {
        if (uow) await uow.DisposeAsync();
    }
};

exports.DepositarAsync = async (req, res) => {
    let uow;
    try {
        const { error, value } = transacaoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ Erro: error.details[0].message });
        }

        uow = new UnitOfWork(getDb());
        await uow.BeginAsync();
        
        if (isNaN(parseInt(req.params.id)) || parseInt(req.params.id) <= 0) {
            return res.status(400).json({ Erro: 'ID não existe na base' });
        }
        const cliente = await uow.clientes.FindByIdAsync(req.params.id);
        if (!cliente) {
            return res.status(404).json({ Erro: 'Cliente não encontrado' });
        }
        
        const novoSaldo = cliente.saldo + value.valor;
        const clienteAtualizado = await uow.clientes.UpdateSaldoAsync(cliente.id, novoSaldo);
        
        await uow.CommitAsync();
        res.json(clienteAtualizado);
    } catch (err) {
        if (uow) await uow.RollbackAsync();
        res.status(400).json({ Erro: err.message });
    } finally {
        if (uow) await uow.DisposeAsync();
    }
};

exports.SacarAsync = async (req, res) => {
    let uow;
    try {
        const { error, value } = transacaoSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ Erro: error.details[0].message });
        }

        uow = new UnitOfWork(getDb());
        await uow.BeginAsync();
        
        const cliente = await uow.clientes.FindByIdAsync(req.params.id);
        if (!cliente) {
            return res.status(404).json({ Erro: 'Cliente não encontrado' });
        }
        
        if (cliente.saldo < value.valor) {
            return res.status(400).json({ Erro: 'Saldo insuficiente' });
        }
        
        const novoSaldo = cliente.saldo - value.valor;
        const clienteAtualizado = await uow.clientes.UpdateSaldoAsync(cliente.id, novoSaldo);
        
        await uow.CommitAsync();
        res.json(clienteAtualizado);
    } catch (err) {
        if (uow) await uow.RollbackAsync();
        res.status(400).json({ Erro: err.message });
    } finally {
        if (uow) await uow.DisposeAsync();
    }
};

exports.UpdateAsync = async (req, res) => {
    let uow;
    try {
        const updateSchema = clienteSchema.fork(['nome', 'email'], (schema) => schema.optional());
        const { error, value } = updateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ Erro: error.details[0].message });
        }

        uow = new UnitOfWork(getDb());
        await uow.BeginAsync();
        
        const cliente = await uow.clientes.FindByIdAsync(req.params.id);
        if (!cliente) {
            return res.status(404).json({ Erro: 'Cliente não encontrado' });
        }
        
        const clienteAtualizado = cliente;
        for (let key in req.body) {
            clienteAtualizado[key] = req.body[key];
}
        const resultado = await uow.clientes.UpdateByIdAsync(clienteAtualizado.id, clienteAtualizado);
        
        await uow.CommitAsync();
        res.json(resultado);
    } catch (err) {
        if (uow) await uow.RollbackAsync();
        
        if (err.message.includes('UNIQUE')) {
            res.status(400).json({ Erro: 'Email já existe na base' });
        } else {
            res.status(400).json({ Erro: err.message });
        }
    } finally {
        if (uow) await uow.DisposeAsync();
    }
};

exports.DeleteByIdAsync = async (req, res) => {
    let uow;
    try {
        uow = new UnitOfWork(getDb());
        await uow.BeginAsync();
        
        const cliente = await uow.clientes.FindByIdAsync(req.params.id);
        if (!cliente) {
            return res.status(404).json({ Erro: 'Cliente não encontrado' });
        }
        
        await uow.clientes.DeleteByIdAsync(cliente.id);
        await uow.CommitAsync();
        
        res.status(204).send();
    } catch (err) {
        if (uow) await uow.RollbackAsync();
        res.status(400).json({ Erro: err.message });
    } finally {
        if (uow) await uow.DisposeAsync();
    }
};