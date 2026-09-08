const bcrypt =  require('bcryptjs')


const hashPW = (password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash
}

const compPW  = (Pw, hashPw) => {
    return bcrypt.compareSync(Pw, hashPw); 
}

module.exports = {hashPW, compPW}