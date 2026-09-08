const { verifToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req,res,next) =>{
    try {
        const {authorization} = req.headers
        if (!authorization) throw {name : 'Unauthorize'}
        const access_token = authorization.split(" ")[1]
        // console.log(access_token);
        const payload = verifToken(access_token)
        // console.log(payload.id);
        

        const user = await User.findByPk(payload.id)
        // console.log(user);
        

        if (!user) throw {name : 'Unauthorize'}


        req.loginInfo = {
            userId : user.id,
            email : user.email,
            role : user.role
        }

        // console.log(req.loginInfo);
        next()
        
    } catch (error) {
        next(error)
    }

}

module.exports = authentication