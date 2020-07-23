const router = require("express").Router()
const UserControllers = require("../controllers/userController")
const BookmarkControllers = require("../controllers/bookmarkController")
const UserController = require("../controllers/userController")
const Auth = require("../middleware/Auth")



router.get("/user", UserControllers.findUser)
router.post("/user/register", UserControllers.addUser)
router.post("/user/login", UserController.login)

router.use(Auth.auth)

router.post("/bookmark", BookmarkControllers.addBookmark)



module.exports = router