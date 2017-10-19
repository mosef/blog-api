const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

//test 4 endpoints, GET, POST, DELETE, PUT

describe('Blog posts', function() {
    before(function() {
        return runServer();
      });
    
      after(function() {
        return closeServer();
      });

    it('should retrieve posts on GET', function() {
        return chai.request(app)
            .get('/blog-posts/')
            .then(function(res) {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);
                const expectedKeys = ['title', 'content', 'author'];
                res.body.forEach(function(post) {
                    post.should.be.a('object');
                    post.should.include.keys(expectedKeys);
                });
            });
    });
    it('should make a blog post on POST', function() {
        const newPost = {title: 'test post', content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam', author: 'Botman'};
        return chai.request(app)
            .post('/blog-posts/')
            .send(newPost)
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.include.keys('title', 'content', 'author');
                res.body.content.should.not.be.null;
            });
    });
    it('should update post content on PUT', function() {
        const updateTitle = {title: 'Top 10 clickbaits', content: 'new content', author:'newBot', publishDate: '1508369057126'};
        return chai.request(app)
        .get('/blog-posts/')
        .then(function(res) {
            updateTitle.id = res.body[0].id;
            return chai.request(app)
            .put(`/blog-posts/${updateTitle.id}`)
            .send(updateTitle)
        })
        .then(function(res) {
            res.should.have.status(204)
        });
    });
    it('should delete blog post on DELETE', function() {
        return chai.request(app)
        .get('/blog-posts/')
        .then(function(res) {
            return chai.request(app)
                .delete(`/blog-posts/${res.body[0].id}`)
        })
        .then(function(res) {
            res.should.have.status(204);
        });
    });
});