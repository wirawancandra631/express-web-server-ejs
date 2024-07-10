
module.exports = function (req, res, next) {
  res.locals.session=req.session
  if (Object.keys(req.body).length > 0) {
    console.log(`======== Body logging =======`);
    for (const key in req.body) {
      console.log(`Body name : ${key} with value ${req.body[key]}`);
    }
  }
  res.locals.formatCurrency = (number) =>
    Number(number).toLocaleString("id", {
      style: "currency",
      currency: "IDR",
    });
  next();
};
