const setUp = require('@shelf/jest-mongodb/setup');
const mongoose = require('mongoose');
const { authUsers } = require ('../controller/auth');
const {
  postAdminUser,
  postUsers,
} = require('../controller/users');

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

afterAll(async () => {
  await mongoose.connection.close();
});

reqPostUser = {
  body: {
    email: 'test@test.test',
    password: 'test123',
    roles: {
      admin: false 
    },
  },
}
const req = {
  body: {
    email: 'test@test.test',
    password: '123456'
  }
};

const req400 = {
  body: {
    email: '',
    password: ''
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
    console.log('NEW USERRRRSRRRR',newUser);
    const auth = await authUsers(req, res, next);
    console.log('AUUUUTHHHHH',auth);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls.length).toBe(1);
  });
  it.skip('auth user', async () => {
    const res = mockResponse();
    const auth = await authUsers(req, res, next);
    console.log('AUUUUTHHHHH',auth);
    expect(res.json).toHaveBeenCalled();
    expect(res.json.mock.calls.length).toBe(1);
  });

  it.skip('require next 400', () => {
    authUsers(req400, res400, next);
    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(400);
    expect(next.mock.calls.length).toBe(2);
  });
});


// -----------------------------------------------

// const res = {
//   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MTE1YWQ3ZjExMmY1MjFmOTljNTU1MGEiLCJlbWFpbCI6InRlc3RAdGVzdC50ZXN0Iiwicm9sZXMiOnsiYWRtaW4iOmZhbHNlfSwiaWF0IjoxNjI5OTA3NjU4LCJleHAiOjE2Mjk5MjIwNTh9.omIfsKyNtim8gP6K15ZOgkLqgCNi3z3vmylK8ppbYzA' 
// }

// const res400 = {
//   msg: 'Usuario / Password no son correctos - password' 
// }





// describe('auth', ()=>{
//   test('authusers', async()=>{
//     const res = mockResponse();
//     const auth = await authUsers(req, res, next);
//     console.log(auth);
//     console.log('req80',req);
//     console.log('res81',res);
//     expect(res.status).toHaveBeenCalledWith(auth);
//     expect(res.json).toHaveBeenCalled();
//     expect(req.session.data).toEqual({
//       email: 'test@test.test',
//     });
//   });
// })  


// params: {
  //   uid: '6115ad7f112f521f99c5550a'
  // },
  // protocol: 'https',
  // path: 'path',
  // get(host) {
  //   return `${host}`;
  // }

  // const mockRequest = (/* sessionData, */ body) => ({
  //   // session: { data: sessionData },
  //   body,
  // });
  
  // const req = mockRequest(
  //   {
  //     email: 'test@test.test',
  //     password: '123456'
  //   },
  // );

  
// const mockResponse = () => {
//   const res = {};
//   // replace the following () => res
//   // with your function stub/mock of choice
//   // making sure they still return `res`
//   res.status = () => jest.fn().mockReturnValue(res);
//   res.json = jest.fn((body) => body);
//   return res;
// };
