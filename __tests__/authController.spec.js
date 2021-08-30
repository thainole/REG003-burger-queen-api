const setUp = require('@shelf/jest-mongodb/setup');
const mongoose = require('mongoose');
const { authUsers } = require ('../controller/auth');
const { postUsers } = require('../controller/users');

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

reqPostUser = {
  body: {
    email: 'hola@test.test',
    password: 'test123',
    roles: {
      admin: false 
    },
  },
};

reqPostUserAdmin = {
  body: {
    email: 'admin@test.test',
    password: 'test123',
    roles: {
      admin: true 
    },
  },
};

const req = {
  body: {
    email: 'hola@test.test',
    password: '123456'
  }
};

const req400 = {
  body: {
    email: '',
    password: ''
  }
};

const req404 = {
  body: {
    email: 'hola',
    password: '123456'
  }
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

describe('Auth user', () => {
  it('auth user', async () => {
    const res = mockResponse();
    const newUser = await postUsers(reqPostUser, res, next);
    const auth = await authUsers(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls.length).toBe(1);
  });
  it('auth admin user', async () => {
    const res = mockResponse();
    const newUser = await postUsers(reqPostUserAdmin, res, next);
    const auth = await authUsers(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls.length).toBe(1);
  });
  it('require next 400', async() => {
    const res = mockResponse();
    await authUsers(req400, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
    expect(next.mock.calls.length).toBe(3);
  });
  it('require next 404', async() => {
    const res = mockResponse();
    await authUsers(req404, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);
    expect(next.mock.calls.length).toBe(4);
  });
});