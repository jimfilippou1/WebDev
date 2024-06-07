const bcrypt = require('bcrypt');
const db = require('../db_connect');

const user_login = (username, password, callback) => {
    const query = 'SELECT username, password, role FROM users WHERE username = ?';

    db.query(query, [username], (error, results) => {
        if (error) {
            console.error('Error executing the query:', error);
            return callback(error, null, null); // Pass error, authentication status, and role as null
        }

        if (results.length === 0) {
            console.log('User not found');
            return callback(null, false, null); // Pass null for error, false for authentication status, and null for role
        }

        const user = results[0];
        const hashedPassword = user.password;
        const role = user.role; // Extract role from the query results

        if (bcrypt.compareSync(password, hashedPassword)) {
            console.log('Login successful');
            return callback(null, true, role); // Pass null for error, true for authentication status, and role
        } else {
            console.log('Invalid password');
            return callback(null, false, null); // Pass null for error, false for authentication status, and null for role
        }
    });
};

module.exports = user_login;
