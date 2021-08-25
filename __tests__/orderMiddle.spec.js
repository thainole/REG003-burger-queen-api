const { isValidMongoId, validOrderId } = require('../middleware/orders');

const req = {
  params: {
    orderId: '612428a85681fb1da7651c2c'
  }
};

const req404 = {
  params: {
    orderId: 'holasoyunaorden'
  }
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('isValidMongoId', () => {
  it('Should be true', () => {
    expect(isValidMongoId('612428a85681fb1da7651c2c')).toBeTruthy();
  });
  it('Should be false', () => {
    expect(isValidMongoId('holisss')).toBeFalsy();
  });
});

describe('validOrderId', () => {
  it('Should return next()', () => {
    validOrderId(req, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
  it('Should return next(404)', () => {
    validOrderId(req404, '', next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);
    expect(next.mock.calls.length).toBe(1);
  });
});
