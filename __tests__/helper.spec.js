const { isValidEmail, pagination } = require('../helpers/helper');

describe('is valid email', () => {
  it('should be true', () => {
    expect(isValidEmail('test@test.test')).toBeTruthy();
  });
  it('should be false', () => {
    expect(isValidEmail('test')).toBeFalsy();
  });
});
describe('generate a link to pagination', () => {
  const resp = {
    hasPrevPage: false,
    hasNextPage: true,
  };
  const url = 'localhost/';
  const page = 5;
  const limit = 20;
  const total = 100;
  const result = {
    first: 'localhost/?limit=20&page=1',
    prev: 'localhost/?limit=20&page=5',
    next: 'localhost/?limit=20&page=6',
    last: 'localhost/?limit=20&page=100', };
  it('should be return link', () => {
    expect(pagination(resp, url, page, limit, total)).toEqual(result);
  });

});
