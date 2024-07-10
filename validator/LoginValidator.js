const { body, validationResult } = require("express-validator");


const schemaLoginValidator=[
    body("username").notEmpty().withMessage("Username wajib diisi"),
    body("password").notEmpty().withMessage("Password wajib diisi")
]

const loginValidate=(req,res,next)=>{
    const {errors}=validationResult(req);
    console.log(errors)
    if(errors.length > 0){
        req.flash("message_validation",errors)
        res.redirect("/login");
    }
    else {
        next()
    }
}

module.exports={
    schemaLoginValidator,
    loginValidate
}