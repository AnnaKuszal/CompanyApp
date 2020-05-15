const Employee = require('../employee.model.js');
const Department = require('../department.model');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');
const expect = require('chai').expect;


describe('Employee', () => {

  before(async () => {
    try {
      const fakeDB = new MongoMemoryServer();
      const uri = await fakeDB.getConnectionString();
    
      mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('Reading data', () => {

    before(async () => {
      const testDepOne = new Department({ name: 'Department #1' });
      await testDepOne.save();
  
      const testDepTwo = new Department({ name: 'Department #2' });
      await testDepTwo.save();

      const testEmpOne = new Employee({ firstName: 'Thomas', lastName: 'Jefferson', department: testDepOne._id });
      await testEmpOne.save();
    
      const testEmpTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: testDepOne._id });
      await testEmpTwo.save();
    });
  
    it('should return all the data with "find" method', async () => {
  
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });
  

    it('should return a proper document by "firstName" with "findOne" method', async () => {
      const employees = await Employee.findOne({ firstName: 'Jonathan' });
      const expectedName = 'Jonathan';
      expect(employees.firstName).to.be.equal(expectedName);
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });

  describe('Creating data', () => {

    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Thomas', lastName: 'Jefferson', department: 'IT' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  
  });

  describe('Updating data', () => {

    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Thomas', lastName: 'Jefferson', department: 'IT' });
      await testEmpOne.save();

      const testEmpTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'IT' });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Thomas' }, { $set: { firstName: 'Jonas' }});
      const updatedEmployee = await Employee.findOne({ firstName: 'Jonas' });
      expect(updatedEmployee).to.not.be.null;
    });
  
    it('should properly update one document with "save" method', async () => {
      const employees = await Employee.findOne({ firstName: 'Thomas' });
      employees.firstName = 'Jonas';
      await employees.save();
    
      const updatedEmployee = await Employee.findOne({ firstName: 'Jonas' });
      expect(updatedEmployee).to.not.be.null;

    });
  
    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({ }, { $set: { firstName: 'Updated!'}});
      const employees = await Employee.find();
      expect(employees[0].firstName).to.be.equal('Updated!');
      expect(employees[1].firstName).to.be.equal('Updated!');
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
    
  });


  describe('Removing data', () => {
    
    beforeEach(async () => {
      const testEmpOne = new Employee({ firstName: 'Thomas', lastName: 'Jefferson', department: 'IT' });
      await testEmpOne.save();
  
      const testEmpTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'IT' });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Thomas' });
      const removeEmployee = await Employee.findOne({ firstName: 'Thomas'  });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employees = await Employee.findOne({ firstName: 'Thomas'  });
      await employees.remove();
      const removedEmployee = await Employee.findOne({ firstName: 'Thomas'  });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
        await Employee.deleteMany();
      });

  });


});