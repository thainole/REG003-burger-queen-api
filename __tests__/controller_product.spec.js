const setUp = require('@shelf/jest-mongodb/setup');
const mongoose = require('mongoose');
const {
  getProducts,
  getProductById,
  postProduct,
  deleteProduct,
  updateProduct,
} = require('../controller/products');

let connection;
beforeAll(async () => {
  await setUp();
  process.env.DB_URL = process.env.MONGO_URL;
  connection = await mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
});

const req = {
  authToken: {
    uid: '6115ad7f112f521f99c5550a',
    email: 'test@test.test',
    roles: {
      admin: true
    }
  },
  params: {
    uid: '6115ad7f112f521f99c5550a'
  },
  query: {
    limit: '',
    page: ''

  },
  protocol: 'https',
  path: 'path',
  get(host) {
    return `${host}`;
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
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.links = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('get products controller', () => {

  it('get products', async () => {
    const res = mockResponse();
    await getProducts(req, res, next);
    expect(res.links).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();

  });
});

