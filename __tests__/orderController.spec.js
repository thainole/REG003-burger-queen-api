const setUp = require('@shelf/jest-mongodb/setup');
const mongoose = require('mongoose');
const {   
  postOrder,
  deleteOrder,
  getOrders,
  getOrderById,
  updateOrder 
} = require ('../controller/orders');
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
const req = {
  body: {
    userId: "6115ad7f112f521f99c5550a",
    client: "Maisita2",
    products: [{
      productId: "611addf1c18bd21d1fe13faa",
      qty: 50
    },
    {
      productId: "611addf7c18bd21d1fe13fad",
      qty: 20
    }]
  },
  params: {
    orderId: '6127d0f63720161dcab8deba'
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
}

const req400 = {
  body: {
    userId: "6115ad7f112f521f99c5550a",
    client: "Maisita2",
    products: []
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
} 

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.links = jest.fn().mockReturnValue(res);
  // res.populate = jest.fn().mockReturnValue(res);
  res.json = jest.fn((body) => body);
  return res;
};

const next = jest.fn();

const res400 = {
  statusCode: 400,
  message: "Bad request"
}
const res404 = {
  statusCode: 404,
  message: "Not found"
}

afterEach(() => {
  jest.clearAllMocks();
});



describe('get orders controller', () => {
  it('get orders', async () => {
    const res = mockResponse();
    await getOrders(req, res, next);
    expect(res.links).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
  });
});

describe('getOrderById', () => {
  it('resp json', async () => {
    const res = mockResponse();
    const order = await getOrders(req, res, next);
    req.params = order._id;
    await getOrderById(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(order);
  });
});

describe('put orders controller', () => {
  it('res.json', async () => {
    const res = mockResponse();
    const order = await getOrders(req, res, next);
    req404.params.orderId = order._id;
    await updateOrder(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(order);
  });
});

describe('delete orders controller', () => {
  it('res.json', async () => {
    const res = mockResponse();
    const order = await getOrders(req, res, next);
    req.params = order._id;
    await deleteOrder(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(order);
  });
});

describe('post orders controller', () => {
  it('require next 400', () => {
    postOrder(req400, res400, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
    expect(next.mock.calls.length).toBe(1);
  })
  it('post order', async () => {
    const res = mockResponse();
    const post = await postOrder(req, res, next);
    //expect(res.links).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled(post);
  });

});