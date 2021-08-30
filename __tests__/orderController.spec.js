const setUp = require('@shelf/jest-mongodb/setup');
const mongoose = require('mongoose');
const {   
  postOrder,
  deleteOrder,
  getOrders,
  getOrderById,
  updateOrder 
} = require ('../controller/orders');
const {
  postProduct,
} = require('../controller/products');

const Order = require('../models/order');

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

const reqProduct = { 
  body: {
    name: 'agua',
    price: 2,
    image: 'imagen',
    type: 'tipo'
  }
};

const req = {
  params: {
    orderId: '61242c6a35037b175cd0d37d'
  },
  query: {
    limit: '',
    page: ''
  },
  body: {
    userId: "6115ad7f112f521f99c5550a",
    client: "Joshua Homme",
    products: []
  },
  protocol: 'https',
  path: 'path',
  get(host) {
    return `${host}`;
  }
}

const req400 = {
  body: {
    userId: "6115ad7f112f521f99c5550a",
    client: "Cliente test",
    products: [],
    status: ''
  },
  params: {
    orderId: '61242c7a35037b175cd0d383'
  }
} 

const req404 = {
  body: {},
  params: {
    orderId: '61242c7a35037b175cd0d383'
  }
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.links = jest.fn().mockReturnValue(res);
  res.json = jest.fn(body => body);
  return res;
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('post orders controller', () => {
  it('post order', async () => {
    const res = mockResponse();
    const product = await postProduct(reqProduct, res, next);
    req.body.products.push({productId: product._id, qty: 2});
    const post = await postOrder(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(post);
    expect(res.json.mock.calls.length).toBe(2);
  });
  it('require next 400', () => {
    const res = mockResponse();
    postOrder(req400, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
    expect(next.mock.calls.length).toBe(1);
  });
});

describe('get orders controller', () => {
  it('get orders', async () => {
    const res = mockResponse();
    const product = await postProduct(reqProduct, res, next);
    req.body.products.push({productId: product._id, qty: 2});
    const orders = await getOrders(req, res, next);
    expect(res.links).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls.length).toBe(2);
  });
});

describe('getOrderById', () => {
  it('resp json', async () => {
    const res = mockResponse();
    const product = await postProduct(reqProduct, res, next);
    req.body.products.push({productId: product._id, qty: 2});   
    const order = await getOrders(req, res, next);
    req.params.orderId = order[0]._id;
    const orderbyId = await getOrderById(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(orderbyId);
    expect(res.json.mock.calls.length).toBe(3);
  });
  it('require next 404', async() => {
    const res = mockResponse();
    await getOrderById(req404, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);
  });
});

describe('put order controller', () => {
  it('res.json', async () => {
    const res = mockResponse();
    const product = await postProduct(reqProduct, res, next);
    req.body.products.push({productId: product._id, qty: 2});
    const order = await getOrders(req, res, next); 
    req.params.orderId = order[0]._id;
    const putOrder = await updateOrder(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(putOrder);
    expect(res.json.mock.calls.length).toBe(3);
  });
  it('require next 404', async() => {
    const res = mockResponse();
    await updateOrder(req404, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);
  });
});

describe('delete orders controller', () => {
  it('res.json', async () => {
    const res = mockResponse();
    const product = await postProduct(reqProduct, res, next);
    req.body.products.push({productId: product._id, qty: 2});  
    const order = await getOrders(req, res, next);
    req.params = order[0]._id;
    await deleteOrder(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(order);
    expect(res.json.mock.calls.length).toBe(2);
  });
});