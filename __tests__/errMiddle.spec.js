const errorHandler = require('../middleware/error');

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.statusCode = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});


describe('errorHandler', () => {

  it('should return 401 when err is 401', async () => {
    const res = mockResponse();
    await errorHandler(401, '', res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ statusCode: 401, message: 'Unauthorized' });
  });

  it('should return 500 when err is 500', async () => {
    const res = mockResponse();
    await errorHandler(500, '', res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ statusCode: 500, message: 'Internal server error' });
  });

  it('should return 500 when err is unknown', async () => {
    const res = mockResponse();
    await errorHandler('', '', res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ statusCode: 500, message: 'Internal server error' });
  });

});
