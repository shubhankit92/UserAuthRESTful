let mongoose = require("mongoose");
let User = require('../User');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
let num = ["+919999999999"]
let hash = "$2a$10$oji0lLkb2ccGLe2bdgVpGeKf4j8YV0RZwEVc/TrJMv9KqHB7PmbTG";
let Admin_access_token = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFua3VuYXRoIiwicGFzc3dvcmQiOiIkMmEkMTAkS1YzN0tYS2xPTC8weTRyM01kLmxkLjVreUtEMm5zdW91enN5YUtVY3hrcHRKYW9ENFdBRC4iLCJyb2xlSWQiOiIxIiwiY29udGFjdE51bWJlciI6WzEsMiwzLDRdLCJpYXQiOjE1MjU1NDYxMjB9.FOfxQSuHwFiIUgGE9KVisrc1MLKNODaWJV4o2mYw_wM';
let access_token = 'access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFiYyIsInBhc3N3b3JkIjoiJDJhJDEwJER2N0ZBcDR3aGYwZlV4Ly9VU1gxTE9zd0Vnelh5WmZFdm5mdmJvRk1aNzk0U0tQdHZlalJhIiwicm9sZUlkIjoiMiIsImNvbnRhY3ROdW1iZXIiOlsiOTg3Il0sImlhdCI6MTUyNTU4NDkxM30.EDsX8M_kuGijoqdOSY73noNGu5rkMoZCg7FyEgT0DZw';
chai.use(chaiHttp);

describe('Users', () => {
  describe('CRUD Check', () => {
    it('ADMIN role user can access its own details', (done) => {
      chai.request(server)
      .get('/profile/ankunath')
      .set('cookie', Admin_access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    });

    it('ADMIN role user can access other user details', (done) => {
      chai.request(server)
      .get('/profile/simpleuser')
      .set('cookie', Admin_access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    });

    it('NON-ADMIN role user can access its own details', (done) => {
      chai.request(server)
      .get('/profile/abc')
      .set('cookie', access_token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
      });
    });

    it('NON-ADMIN role user can not access other user details', (done) => {
      chai.request(server)
      .get('/profile/simpleuser')
      .set('cookie', access_token)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
  });
  describe('Make Admin Check ', () => {
    it('ADMIN user can assign other users as ADMIN', (done) => {
      let updatedUser = {
          makeAdmin: true
      }
      chai.request(server)
      .post('/updateUser/userToBeAdmin')
      .set('cookie', Admin_access_token)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it('NON-ADMIN user can not assign other users as ADMIN', (done) => {
      let updatedUser = {
        makeAdmin: true
      }
      chai.request(server)
      .post('/updateUser/userToBeAdmin')
      .set('cookie', access_token)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
  });
  describe('Phone Number Check ', () => {
    it('User can add a phone number', (done) => {
      let updatedUser = {
        contact: ["+919999999991"]
      }
      chai.request(server)
      .post('/updateUser/abc')
      .set('cookie', access_token)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });

    it('Duplicate Number are not allowed', (done) => {
      let updatedUser = {
        contact: ["+919999999991"]
      }
      chai.request(server)
      .post('/updateUser/abc')
      .set('cookie', access_token)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(417);
        done();
      });
    });

    it('Phone Number should be validated', (done) => {
      let updatedUser = {
        contact: ["1234"]
      }
      chai.request(server)
      .post('/updateUser/abc')
      .set('cookie', access_token)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(417);
        done();
      });
    });
    it('User can update his/her phone number', (done) => {
      let updatedUser = {
        oldContact: "+919999999991",
        contact: ["+918888888888"]
      }
      chai.request(server)
      .post('/updateNumber/abc')
      .set('cookie', access_token)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('User can delete his/her phone number', (done) => {
      let updatedUser = {
        contact: "+918888888888"
      }
      chai.request(server)
      .delete('/updateNumber/abc')
      .set('cookie', access_token)
      .send(updatedUser)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });
});