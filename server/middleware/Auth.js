const { User } = require("../models");
const jwt = require("jsonwebtoken");

class Authentication {
  static auth(req, res, next) {
    const { access_token } = req.headers;
    if (!access_token) {
      // res.status(400).json({ message: "token not found" });
      next({name: "token error"})
    } else if (access_token) {
      let decode = jwt.verify(access_token, "secret");
      req.userData = decode;

      User.findByPk(decode.id)
        .then((data) => {
          if (data) {
            next();
          } else {
            // res.status(404).json({ message: "invalid user" });
            next({name: "invalid user"})
          }
        })
        .catch((err) => {
          res.status(500).json(err);
          next({name: err})
        });
    }
  }
}

module.exports = Authentication
