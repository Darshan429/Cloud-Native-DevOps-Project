module.exports = Object.freeze({
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'expense',
    DB_PWD: process.env.DB_PWD || '',
    DB_DATABASE: process.env.DB_DATABASE || 'transactions'
});