const request = require('supertest')
const app = require('../app')
const {hash} = require('../helpers/bcrypt')
const {sequelize} = require('../models')
const { TestScheduler } = require('jest')
const {queryInterface} = sequelize

let bookmark = {
    url:"google.com",
    FolderId:1
}
let folder = {
    name:'general',
    UserId: 1
}

let access_token = ''

describe('Bookmark and Folder Test',() => {
    beforeAll((done) => {
        queryInterface
        .bulkInsert('Users',[
            {
                username: 'admin',
                password: hash('password'),
                email: 'admin@mail.com'
            }
        ])
        .then(() => done())
        .catch(err => done(err))
    })
    afterAll((done) => {
        queryInterface
        .bulkDelete('Users')
        .then(() => {return queryInterface.bulkDelete('Bookmarks')})
        .then(() => {return queryInterface.bulkDelete('Folders')})
        .catch(err => done(err))
    })
    describe('Get access_token',() => {
        it('return status 200 with access_token', (done) => {
            request(app)
            .post('/login')
            .send({
                password: hash('password'),
                email: 'admin@mail.com'
            })
            then((res) => {
                const {body, status} = res
                expect(status).toBe(200)
                expect(body).toHaveProperty('access_token', expect.any(String))
                access_token = body.access_token
                done()
            })
        })
    })
    describe('POST /folder', () => {
        it('Folder has been added', (done) => {
            request(app)
            .post('/folder')
            .set('access_token', access_token)
            .send(folder)
            .then((res) => {
                const {body, status} = res
                expect(body).toHaveProperty('message','folder has been added')
                expect(status).toBe(201)
                done()
            })
        })
    })
    describe('POST /bookmark', () => {
        it('Bookmark has been added', (done) => {
            request(app)
            .post('/bookmark')
            .set('access_token', access_token)
            .send(bookmark)
            .then((res) => {
                const {body, status} = res
                expect(body).toHaveProperty('message','bookmark has been added')
                expect(status).toBe(201)
                done()
            })
        })
    })
    describe('GET /folder',() => {
        it('Folder content',(done) => {
            request(app)
            .get('/folder')
            .set('access_token', access_token)
            .then((res) => {
                const {body,status} = res
                expect(status).toBe(200)
                expect(body).toHaveProperty('name', expect.any(String))
                expect(body).toHaveProperty('UserId', expect.any(Number))
                expect(body).toHaveProperty('Bookmarks')
            })
        })
    })
})
