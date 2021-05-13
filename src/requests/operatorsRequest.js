const operatorsDAO = require('../DAO/operatorsDAO');

const getAllOperators = (db) => {
  return operatorsDAO.getAll(db);
};

const getOperator = (db, id) => {
  return operatorsDAO.getOne(db, id);
};

const createOperator = (db, operator) => {
  return operatorsDAO.create(db, operator);
};

const removeOperator = (db, id) => {
  return operatorsDAO.remove(db, id);
};

const updateOperator = (db, id, operator) => {
  return operatorsDAO.update(db, id, operator);
};


module.exports = {
  getAllOperators,
  getOperator,
  createOperator,
  removeOperator,
  updateOperator
};