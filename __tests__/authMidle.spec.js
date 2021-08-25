const { isAuthenticated,
  isAdmin,
  requireUser,
  requireAdmin,
  requireAuth
} = require('../middleware/auth');

const req = {
  authToken: {
    uid: '6115ad7f112f521f99c5550a',
    email: 'test@test.test',
    roles: {
      admin: true
    }
  },
  parems: {
    uid: '6115ad7f112f521f99c5550a'
  }
};
const req403 = {
  authToken: {
    uid: '6115ad7f112f521f99c5550xx',
    email: 'test@test.test',
    roles: {
      admin: false
    }
  },
  params: {
    uid: '6115ad7f112f521f99c5550a'
  }
};
const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('requireAdmin', () => {
  it('require Admin next', () => {
    requireAdmin(req, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
  it('require next 401', () => {
    requireAdmin('', '', next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(401);
    expect(next.mock.calls.length).toBe(1);
  });
  it('require next 403', () => {
    requireAdmin(req403, '', next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(403);
    expect(next.mock.calls.length).toBe(1);
  });
});

describe('requireUser', () => {
  it('require user next', () => {
    requireUser(req, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
  it('require next 401', () => {
    requireUser('', '', next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(401);
    expect(next.mock.calls.length).toBe(1);
  });
  it('require next 403', () => {
    requireUser(req403, '', next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(403);
    expect(next.mock.calls.length).toBe(1);
  });
});
describe('requireAuth', () => {
  it('require auth next', () => {
    requireAuth(req, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
  it('require auth next 401', () => {
    requireAuth('', '', next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(401);
    expect(next.mock.calls.length).toBe(1);
  });
  describe('isAdmin', () => {
    it('return true', () => {
      expect(isAdmin(req)).toBeTruthy();
    });
  });
  it('return false', () => {
    expect(isAdmin(req403)).toBeFalsy();
  });
  describe('isAutheticated', () => {
    it('return true', () => {
      expect(isAuthenticated(req)).toBeTruthy();
    });
  });
  it('return false', () => {
    expect(isAuthenticated({})).toBeFalsy();
  });
});



