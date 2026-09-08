const errorHandler = (error, req,res,next) =>{
    let status = 500 
    let message = "internal server error"

    if (error.name === "SequelizeUniqueConstraintError") {
        status = 400
        message = "email is already exists"   
    }
            
    if (error.name === "SequelizeValidationError") {
        status = 400
        message = error.errors[0].message  
    }

    if (error.name === "SequelizeDatabaseError") {
        status = 400
        message = "invalid input" 
    }

    if (error.name === "noEmail") {
        status = 400
        message = "email not registered yet" 
    }

    if (error.name === "invalidPW") {
        status = 400
        message = "invalid password" 
    }

    if (error.name === "NotFound") {
        status = 404
        message = "Data Not Found"
    }

    if (error.name === "Unauthorize" || error.name === "JsonWebTokenError" ) {
        message = "please login first"
        status = 400
        
    }

    if (error.name === "noIngridient"  ) {
        message = "no ingredient detected"
        status = 404
        
    }

    if (error.name === "BadRequestING"  ) {
        message = "Ingredients are required"
        status = 400
        
    }

    if (error.name === "BadRequestING"  ) {
        message = "Ingredients are required"
        status = 400
        
    }

    if (error.name === "BadRequestpho" ) {
        message = "photo required"
        status = 400
    }

    if (error.name === "BadRequestName"  ) {
        message = "username required"
        message = "username required"
        status = 400
        
    }



    res.status(status).json({
        message 
    })
    
}

module.exports = errorHandler