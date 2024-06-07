const user_login = require('./user_login');

function loginUser(req, res) {
    const { username, password } = req.body;

    user_login(username, password, (error, success, role) => {
        if (error) {
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Login attempt:', { success, role });
        if (success) {
            req.session.user = { username, role };
            redirectToRolePage(req, res, role);
        } else {
            res.status(401).send('Invalid username or password');
        }
    });
}

function redirectToRolePage(req, res, role) {
    // Define your redirection logic here
    switch (role) {
        case 'patient':
            res.redirect('/patient');
            break;
        case 'doctor':
            res.redirect('/doctor');
            break;
        case 'secretary':
            res.redirect('/secretary');
            break;
        default:
            res.status(403).send('Unauthorized access');
    }
}

module.exports = { loginUser };
