const {Bookmark, Folder} = require("../models")


class BookmarkController {

    static addBookmark(req, res) {
        let bookmark = {
            url: req.body.url,
            FolderId: req.params.id
        }
        Bookmark.create(bookmark)
        .then(data => {
            res.status(201).json({message: 'Bookmark has been added'})
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static addFolder(req, res) {
        let folder = {
            name: req.body.name,
            UserId: req.userData.id,
            FolderId: req.query.id
        }
        Folder.create(folder)
        .then(data => {
            res.status(201).json({message: 'Folder has been added'})
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static showFolder(req, res) {
        Folder.findAll({
            include:{
                model: Folder,
                as: 'Child'
            },
            where:{
                UserId: req.userData.id
            }
        })
        .then(data => {
            res.status(200).json({data})
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static deleteFolder(req, res) {
        Folder.destroy({where:{id: req.params.id}})
        .then(res => {
            res.status(200).json({message: 'Folder has been deleted'})
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}


module.exports = BookmarkController