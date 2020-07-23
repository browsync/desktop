const {Bookmark} = require("../models")


class BookmarkController {

    static addBookmark(req, res) {
        let obj = {
            url: req.body.url,
            UserId: userData.id
        }
        Bookmark.create()
        .then(data => {
            res.status(201).json(data)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}


module.exports = BookmarkController