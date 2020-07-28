const router = require("express").Router()
const UserControllers = require("../controllers/userController")
const BookmarkControllers = require("../controllers/bookmarkController")
const UserController = require("../controllers/userController")
const Auth = require("../middleware/Auth")



router.get("/user", UserControllers.findUser)
router.post("/register", UserControllers.addUser)
router.post("/login", UserController.login)

router.use(Auth.auth)

router.get('/folder',BookmarkControllers.showFolder)
router.post("/folder", BookmarkControllers.addFolder)
router.get("/folder/:id", BookmarkControllers.showOneFolder)
router.post("/bookmark/:id", BookmarkControllers.addBookmark)
router.delete("/folder/:id", BookmarkControllers.deleteFolder)


module.exports = router