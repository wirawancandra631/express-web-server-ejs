const { body, validationResult } = require("express-validator");

const schemaValidator = [
  body("name_product").notEmpty().withMessage("Nama Product Harus diisi"),
  body("price_product").notEmpty().withMessage("Price Product Harus diisi"),
  body("supplier").notEmpty(),
];

const formValidate = (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    console.log("Error")
    req.flash("message_validation",errors);
    res.redirect("/form");

  } else {
    next();
  }
};

module.exports = {
  schemaValidator,
  formValidate,
};
