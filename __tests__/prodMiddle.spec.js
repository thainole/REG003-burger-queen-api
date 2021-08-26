const { validProductId } = require('../middleware/products');

const req = {
  params: {
    productId: '6122dd99eb52790a6a187a1c'
  }
};

const req404 = {
  params: {
    productId: 'holasoyunproducto'
  }
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('validProductId', () => {
  it('Should return next()', () => {
    validProductId(req, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
  it('Should return next(404)', () => {
    validProductId(req404, '', next);
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls.length).toBe(1);
  });
});
