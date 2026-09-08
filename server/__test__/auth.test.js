const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const { User } = require('../models');
const { hashPW } = require('../helpers/bcrypt');

beforeAll(async () => {

    const data = require('../data/users.json');
    const seedData = data.map((el) => ({
        ...el,
        password: hashPW(el.password),
        createdAt: new Date(),
        updatedAt: new Date(),
    }));

    await sequelize.queryInterface.bulkInsert('Users', seedData, {});
});

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, { restartIdentity: true, cascade: true, truncate: true });
});

describe('POST /login', () => {
    describe('POST /login - succeed', () => {
        test('1a. jika email dan password benar, harus return access_token', async () => {
            const body = {
                email: 'budi@example.com',
                password: 'password123',
            };

            const response = await request(app).post('/login').send(body);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('access_token', expect.any(String));
        });
    });

    describe('POST /login - failed', () => {
        test('1b. jika email tidak terdaftar, harus return message error', async () => {
            const body = {
                email: 'tidakterdaftar@example.com',
                password: 'password123',
            };

            const response = await request(app).post('/login').send(body);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'email not registered yet');
        });

        test('1c. jika password salah, harus return message error', async () => {
            const body = {
                email: 'budi@example.com',
                password: 'passwordSalah',
            };

            const response = await request(app).post('/login').send(body);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'invalid password');
        });
    });
});

describe('POST /register', () => {
    describe('POST /register - succeed', () => {
        test('2a. jika berhasil register, harus return object user baru', async () => {
            const body = {
                username: 'User Baru',
                email: 'userbaru@example.com',
                password: 'password123',
                avatarUrl: 'https://i.pravatar.cc/150?img=9',
            };

            const response = await request(app).post('/register').send(body);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'succeed to register');
            expect(response.body).toHaveProperty('data', expect.any(Object));
            expect(response.body.data).toHaveProperty('email', body.email);

            // bersihkan data yang baru dibuat supaya tidak bentrok di test lain
            await User.destroy({ where: { email: body.email } });
        });
    });

    describe('POST /register - failed', () => {
        test('2b. jika format email salah, harus return message error', async () => {
            const body = {
                username: 'Email Salah',
                email: 'bukan-email',
                password: 'password123',
            };

            const response = await request(app).post('/register').send(body);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', expect.any(String));
        });

        test('2c. jika password dibawah 8 karakter, harus return message error', async () => {
            const body = {
                username: 'Password Pendek',
                email: 'passwordpendek@example.com',
                password: '123',
            };

            const response = await request(app).post('/register').send(body);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', expect.any(String));
        });
    });
});
