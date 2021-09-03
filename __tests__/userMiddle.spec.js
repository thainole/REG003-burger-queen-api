const { validUserId } = require('../middleware/user');

const reqId = {
  params: {
    uid: '6422cc99eb52790a3a187a4c'
  }
};

const reqEmail = {
  params: {
    uid: 'test@test.com'
  }
};

const req404 = {
  params: {
    uid: 'holasoyunuid'
  }
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('validUserId', () => {
  it('Should return next() with Id', () => {
    validUserId(reqId, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
  it('Should return next() with email', () => {
    validUserId(reqEmail, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
  it('Should return next(404)', () => {
    validUserId(req404, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
});
