const ClienteRepository = require('../../repositories/cliente.repository');

class UnitOfWork {
    constructor(db) {
        this.db = db;
        this.clientes = new ClienteRepository(db);
        this._isInTransaction = false;
    }

    async BeginAsync() {
        if (!this._isInTransaction) {
            await this.db.exec('BEGIN TRANSACTION');
            this._isInTransaction = true;
        }
    }

    async CommitAsync() {
        if (this._isInTransaction) {
            await this.db.exec('COMMIT');
            this._isInTransaction = false;
        }
    }

    async RollbackAsync() {
        if (this._isInTransaction) {
            await this.db.exec('ROLLBACK');
            this._isInTransaction = false;
        }
    }

    async DisposeAsync() {
        if (this._isInTransaction) {
            await this.RollbackAsync();
        }
    }
}

module.exports = UnitOfWork;