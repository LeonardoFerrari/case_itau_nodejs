class ClienteRepository {
    constructor(db) {
        this.db = db; 
    }

    async FindAllAsync() {
        return await this.db.all('SELECT * FROM clientes');
    }

    async FindByIdAsync(id) {
        return await this.db.get('SELECT * FROM clientes WHERE id = ?', [id]);
    }

    async CreateAsync({ nome, email }) {
        const result = await this.db.run(
            'INSERT INTO clientes(nome, email, saldo) VALUES(?, ?, 0)', 
            [nome, email]
        );
        return await this.FindByIdAsync(result.lastID);
    }

    async UpdateByIdAsync(id, cliente) {
        const { nome, email, saldo } = cliente;
        await this.db.run(
            'UPDATE clientes SET nome = ?, email = ?, saldo = ? WHERE id = ?', 
            [nome, email, saldo || 0, id]
        );
        return await this.FindByIdAsync(id);
    }

    async DeleteByIdAsync(id) {
        return await this.db.run('DELETE FROM clientes WHERE id = ?', [id]);
    }

    async UpdateSaldoAsync(id, novoSaldo) {
        await this.db.run('UPDATE clientes SET saldo = ? WHERE id = ?', [novoSaldo, id]);
        return await this.FindByIdAsync(id);
    }
}

module.exports = ClienteRepository;