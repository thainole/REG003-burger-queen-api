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
afterAll(async () => {
  await mongoose.connection.close();
});
const req = {
  params: {
    productId: '61281415ef0ee627fd28410e'
  },
  query: {
    limit: '',
    page: ''
  },
  body: {
    name: 'agua',
    price: 2,
    image: 'imagen',
    type: 'tipo'
  },
  protocol: 'https',
  path: 'path',
  get(host) {
    return `${host}`;
  }
};

const req403 = {
  params: {
    productId: '6115ad7f112f521f99c5550b'
  },
  body: {},
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.links = jest.fn().mockReturnValue(res);
  res.json = jest.fn((body) => body);
  return res;
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('Post products', () => {
  it('Return next 400', async () => {
    const res = mockResponse();
    await postProduct(req403, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
  });
  it('return  resp.json', async () => {
    const res = mockResponse();
    const post = await postProduct(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(post);
  });
});

describe('get products controller', () => {

  it('get products OK', async () => {
    const res = mockResponse();
    const product = await getProducts(req, res, next);
    expect(res.links).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(product);

  });
});
describe('getProductById', () => {
  it('next 404', async () => {
    const res = mockResponse();
    const product = await getProductById(req403, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);

  });
  it('resp json', async () => {
    const res = mockResponse();
    const product = await getProducts(req, res, next);
    req.params = product[0]._id;
    const productById = await getProductById(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(product);
  });
});
describe('Delete Products', () => {
  it('next 404', async () => {
    const res = mockResponse();
    const productById = await deleteProduct(req403, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);

  });
  it('res.json', async () => {
    const res = mockResponse();
    const product = await getProducts(req, res, next);
    req.params = product[0]._id;
    await deleteProduct(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(product);

  });
});
describe('Update Products', () => {
  it('next 404', async () => {
    const res = mockResponse();
    await updateProduct(req403, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);

  });
  it('next 400', async () => {
    const res = mockResponse();
    const product = await getProducts(req, res, next);
    req403.params.productId = product[0]._id;
    await updateProduct(req403, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
  });
  it('res.json', async () => {
    const res = mockResponse();
    const product = await getProducts(req, res, next);
    req403.params.productId = product[0]._id;
    await updateProduct(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(product);
  });
});


