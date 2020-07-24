const { User, Bookmark } = require("../models");
const jwt = require("jsonwebtoken");

class UserController {
  static addUser(req, res, next) {
    let obj = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    User.create(obj)
      .then((data) => {
        res
          .status(201)
          .json({ message: "New user has been registered", data: data });
      })
      .catch((err) => {
        // res.status(500).json(err);
        next({name: err})
      });
  }

  static findUser(req, res, next) {
    User.findOne({
      where: {
        id: req.params,
      },
      include: [Bookmark],
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        // res.status(500).json(err);
        next({name: err})
      });
  }

  static login(req, res, next) {
    let user = {
      email: req.body.email,
      password: req.body.password,
    };

    // console.log("masukll");
    User.findOne({
      where: {
        email: req.body.email,
      },
    })
      .then((data) => {
        if (data && data.password === user.password) {
          const token = jwt.sign({ id: data.id, email: data.email }, "secret");
          res
            .status(200)
            .json({ access_token: token, message: "Login successful" });
        } else {
          // res.status(403).json({ message: `invalid email or password` });
          next({name: "forbidden"})
        }
      })
      .catch((err) => {
        // res.status(500).json(err);
        next({name: err})
      });
  }
}

module.exports = UserController;
