
jest.mock('@imagekit/nodejs', () => {
    const mockUpload = jest.fn().mockResolvedValue({
        url: 'https://mocked-imagekit.io/avatar-mocked.png',
    });
    const MockImageKit = jest.fn().mockImplementation(() => ({
        files: { upload: mockUpload },
    }));
    MockImageKit.toFile = jest.fn().mockResolvedValue('mockedFile');
    MockImageKit.__mockUpload = mockUpload;
    return MockImageKit;
});

const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');
const { hashPW } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const ImageKit = require('@imagekit/nodejs');

let acc_token;
let userId;

beforeAll(async () => {
    const data = require('../data/users.json');
    const seedData = data.map((el) => ({
        ...el,
        password: hashPW(el.password),
        createdAt: new Date(),
        updatedAt: new Date(),
    }));

    await sequelize.queryInterface.bulkInsert('Users', seedData, {});

    const user = await User.findOne({ where: { email: 'budi@example.com' } });
    userId = user.id;

    acc_token = signToken({
        id: user.id,
        email: user.email,
        name: user.username,
    });
});

afterEach(() => {
    jest.restoreAllMocks();
    ImageKit.__mockUpload.mockClear();
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, { restartIdentity: true, cascade: true, truncate: true });
});

describe('PATCH /user/profile/:id', () => {
    describe('PATCH /user/profile/:id - succeed', () => {
        test('6a. jika berhasil upload foto profil', async () => {
            const response = await request(app)
                .patch(`/user/profile/${userId}`)
                .set('Authorization', `Bearer ${acc_token}`)
                .attach('profile', Buffer.from('fake-avatar-bytes'), 'avatar.png');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', expect.any(String));
            expect(response.body).toHaveProperty('data', expect.any(String));
        });
    });

    describe('PATCH /user/profile/:id - failed', () => {
        test('6b. jika tidak mengisi foto, harus return error', async () => {
            const response = await request(app)
                .patch(`/user/profile/${userId}`)
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', expect.any(String));
        });
    });
});

describe("PATCH /user/name/:id", () => {
  describe("PATCH /user/name/:id - succeed", () => {
    test("7a. jika berhasil mengganti username", async () => {
      const response = await request(app)
        .patch(`/user/name/${userId}`)
        .set("Authorization", `Bearer ${acc_token}`)
        .send({
          username: "usernameBaru",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "message",
        expect.any(String)
      );
      expect(response.body).toHaveProperty(
        "data",
        expect.any(String)
      );
    });
  });

  describe("PATCH /user/name/:id - failed", () => {
    test("7b. jika username tidak dikirim, harus return error", async () => {
      const response = await request(app)
        .patch(`/user/name/${userId}`)
        .set("Authorization", `Bearer ${acc_token}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        expect.any(String)
      );
    });

    test("7c. jika username kosong, harus return error", async () => {
      const response = await request(app)
        .patch(`/user/name/${userId}`)
        .set("Authorization", `Bearer ${acc_token}`)
        .send({
          username: "",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        expect.any(String)
      );
    });

    test("7d. jika user tidak ditemukan, harus return error", async () => {
      const response = await request(app)
        .patch(`/user/name/999999`)
        .set("Authorization", `Bearer ${acc_token}`)
        .send({
          username: "usernameBaru",
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        expect.any(String)
      );
    });
  });
});
