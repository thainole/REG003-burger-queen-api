const setUp = require('@shelf/jest-mongodb/setup');
const mongoose = require('mongoose');
const {
  getUsers,
  postAdminUser,
  postUsers,
  getUserId,
  deleteUser,
  updateUser,
} = require('../controller/users');

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
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn((body) => body);
  res.links = jest.fn().mockReturnValue(res);
  return res;
};
const req = {
  params: {
    uid: 'test@test.test'
  },
  body: {
    email: 'test@test.test',
    password: 'test123',
    roles: {
      admin: false },
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
const reqError = {
  params: {
    uid: 'alguien@gmail.com'
  },
  body: {},
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
const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe(' postUsers ', () => {
  it('create user', async () => {
    const res = mockResponse();
    const user = await postUsers(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(user);
  });
  it('next 400', async () => {
    const res = mockResponse();
    await postUsers(reqError, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
  });
  it('next 403', async () => {
    const res = mockResponse();
    await postUsers(req, res, next);
    await postUsers(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(403);
  });
});

describe('get users', () => {
  it('resp json', async () => {
    const res = mockResponse();
    const user = await getUsers(req, res, next);
    expect(res.links).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(user);
  });

});
describe('get users by id', () => {
  it('resp json', async () => {
    const res = mockResponse();
    await postUsers(req, res, next);
    const user = await getUserId(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(user);
  });
  it('next', async () => {
    const res = mockResponse();
    const user = await getUserId(reqError, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);
  });
});

describe('delete users by id', () => {
  it('resp json', async () => {
    const res = mockResponse();
    await postUsers(req, res, next);
    const user = await deleteUser(req, res, next);
    expect(res.json).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(user);
  });
  it('next', async () => {
    const res = mockResponse();
    const user = await deleteUser(reqError, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);
  });
});
describe('update users by id', () => {
  it('resp json', async () => {
    const res = mockResponse();
    await postUsers(req, res, next);
    req.body.password = 'changepassword';
    const user = await updateUser(req, res, next);
    expect(res.json).toHaveBeenCalled();
  });
  it('next', async () => {
    const res = mockResponse();
    const user = await updateUser(reqError, res, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(404);
  });
});
