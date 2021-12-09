const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = (passwordToHash) => {
    if (!passwordToHash) return;

    return bcrypt.hashSync(passwordToHash, saltRounds)
}

const comparePassword = (passwordToCompare, hashedPw) => {
    if (!passwordToCompare) return;

    return bcrypt.compareSync(passwordToCompare, hashedPw);
}

module.exports = { hashPassword, comparePassword }