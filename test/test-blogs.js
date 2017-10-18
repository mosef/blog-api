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
            });
    });
});