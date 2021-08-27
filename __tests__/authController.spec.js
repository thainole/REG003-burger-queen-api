const setUp = require('@shelf/jest-mongodb/setup');
const mongoose = require('mongoose');
const { authUsers } = require ('../controller/auth');

// -----------------------------------------------
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
  body: {
    email: 'test@test.test',
    password: '123456'
  },
  // params: {
  //   uid: '6115ad7f112f521f99c5550a'
  // },
  protocol: 'https',
  path: 'path',
  get(host) {
    return `${host}`;
  }
};

const req400 = {
  body: {
    email: '',
    password: ''
  }
};

const res = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTE1YWQ3ZjExMmY1MjFmOTljNTU1MGEiLCJlbWFpbCI6InRlc3RAdGVzdC50ZXN0Iiwicm9sZXMiOnsiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNjI5OTA3NjU4LCJleHAiOjE2Mjk5MjIwNTh9.omIfsKyNtim8gP6K15ZOgkLqgCNi3z3vmylK8ppbYzA' 
}

const res400 = {
  msg: 'Usuario / Password no son correctos - password' 
}

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('Auth user', () => {
  it.skip('auth user', async () => {
    const res = mockResponse();
    await authUsers(req, res, next);
    expect(res.json).toHaveBeenCalled();
  });

  it('require next 400', () => {
    authUsers(req400, res400, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
    expect(next.mock.calls.length).toBe(1);
  });
});


// -----------------------------------------------
// describe('auth user', ()=> {
//   jest.spyOn(Usuario, 'findOne').mockReturnValue(Promise.resolve({ email: "test@gmail.com" }))
// })

// describe('When email user exists', () => {
//   beforeAll(() => {
//     Usuario.findOne = jest.fn().mockResolvedValue([{
//         email: 'test@test.test',
//       }
//     ])
//   });
//   it('Should return token', async() => {
//     const worldService = new WorldService(Usuario);
//     const expected = [{
//         res
//       },
//     ];
//       await expect(worldService.getWorlds()).resolves.toEqual(expected);
//   });
// });

