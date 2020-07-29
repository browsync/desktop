const {Bookmark, Folder} = require("../models")


class BookmarkController {

    static addBookmark(req, res, next) {
        let bookmark = {
            url: req.body.url,
            FolderId: req.params.id
        }
        Bookmark.create(bookmark)
        .then(data => {
            res.status(201).json({ data, message: 'Bookmark has been added'})
        })
        .catch(err => {
            res.status(500).json(err)
            next({name: err})

        })
    }

    static addFolder(req, res, next) {
        let folder = {
            name: req.body.name,
            UserId: req.userData.id,
            FolderId: req.query.id || null
        }
        Folder.create(folder)
        .then(data => {
            res.status(201).json({ data, message: 'Folder has been added',data: data})
        })
        .catch(err => {
            // res.status(500).json(err)
            next({name: err})
        })
    }

    static showFolder(req, res, next) {
        Folder.findAll({
            include:[{
                model: Folder,
                as: 'Child'
            },{
                model: Bookmark
            }],
            where:{
                UserId: req.userData.id
            }
        })
        .then(data => {
            res.status(200).json({data})
        })
        .catch(err => {
            // res.status(500).json(err)
            next({name: err})
        })
    }

    static showOneFolder(req, res, next) {
        Folder.findByPk(req.params.id,{
            include:[{
                model: Folder,
                as: 'Child'
            },{
                model: Bookmark
            }],
            where:{
                UserId: req.userData.id
            }
        })
        .then(data => {
            res.status(200).json({data})
        })
        .catch(err => {
            // res.status(500).json(err)
            next({name: err})
        })
    }

    static deleteFolder(req, res, next) {
        Folder.destroy({where:{id: req.params.id}})
        .then(res => {
            res.status(200).json({message: 'Folder has been deleted'})
        })
        .catch(err => {
            // res.status(500).json(err)
            next({name: err})
        })
    }
}


module.exports = BookmarkController