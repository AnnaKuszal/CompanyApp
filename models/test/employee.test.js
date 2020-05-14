const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

  it('should throw an error if any arg is missing', () => {
    const empl1 = new Employee({});
    
    const empl2 = new Employee({
        firstName: 'John',
        department: '5eb5768a020a147f15841428'
    });
    
    const empl3 = new Employee({ firstName: 'John', lastName: 'Doe' });
    
    const empl4 = new Employee({
        lastName: 'Doe',
        department: '5eb5768a020a147f15841428'
    });
    
    const cases = [empl1, empl2, empl3, empl4];
    for (let employee of cases) {
      employee.validate(err => {
        expect(err.errors).to.exist;
      });
    }

  });

  it('should throw an error if any arg is not a string', () => {
    const empl1 = new Employee({
      firstName: 'John',
      lastName: [],
      department: 'IT'
    });

    const empl2 = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      department: []
    });

    const empl3 = new Employee({
      firstName: {},
      lastName: 'Doe',
      department: 'IT'
    });

    const cases = [empl1, empl2, empl3];

    for (let employee of cases) {
      employee.validate(err => {
        expect(err.errors).to.exist;
      });
    }
  });

  it('should not throw an error if arguments are OK', () => {
    const employee1 = new Employee({
      firstName: 'John',
      lastName: 'Doe',
      department: '5eb5768a020a147f15841428'
    });

    employee1.validate(err => {
      expect(err).to.not.exist;
    });
  });
  
});  
  
  after(() => {
    mongoose.models = {};
  });