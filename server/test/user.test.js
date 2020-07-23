const request = require('supertest')
const app = require('../app')

describe('User tests', function(){
    describe('POST /register', function(){
        it('New user has been registered', function(done){
            let user = {
                email: 'test@email.com',
                password: 'password',
                username: 'admin',
            }
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
            let user = {
                email: 'test@mail.com',
                password: 'password'
            }
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
    describe('POST /bookmark', function(){
        it('Bookmark is added', function(done){
            
        })
    })
})


