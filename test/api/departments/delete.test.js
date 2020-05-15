const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server.js');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {

  before(async () => {
    const testDepOne = new Department({ _id: '5eb5768a020a147f1584142a', name: 'Department #1' });
    await testDepOne.save();

  });

  it('/:id should delete chosen document and return success', async () => {
    const res = await request(server).delete(
        '/api/departments/5eb5768a020a147f1584142a'
      );
      const deletedDepartment = await Department.findOne({
        name: '#Department #1'
      });
  
      expect(res.status).to.be.equal(200);
      expect(deletedDepartment).to.be.null;
  });

  after(async () => {
    await Department.deleteMany();
  });

});