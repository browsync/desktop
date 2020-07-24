const request = require('supertest')
const app = require('../app')
const {hash} = require('../helpers/bcrypt')
const {sequelize} = require('../models')
const {queryInterface} = sequelize

let user = {
    email: 'register@email.com',
    password: 'password',
    username: 'admin',
}

describe('User tests', function(){
    afterAll((done) => {
        queryInterface
        .bulkdelete('Users')
        .then(()=> done())
        .catch(err => console.log(err))
    })
    describe('POST /register', function(){
        it('New user has been registered', function(done){
            request(app)
            .post('/register')
            .send(user)
            .then(res => {
                const {body, status} = res
                expect(status).toBe(201)
                expect(body).toHaveProperty('message','New user has been registered')
                done()
            })
        })
    })
    describe('POST /login', function(){
        it('User successfully logged in', function(done){
            request(app)
            .post('/login')
            .send(user)
            .then(res => {
                const {body, status} = res
                expect(status).toBe(200)
                expect(body).toHaveProperty('message', 'Login successful')
                done()
            })
        })
    })
})


