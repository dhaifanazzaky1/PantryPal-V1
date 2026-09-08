const request = require('supertest');
const app = require('../app');
const axios = require('axios');
const { sequelize, User, SavedRecipe } = require('../models');
const { hashPW } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

let acc_token;
let userId;
let existingSavedRecipeId;

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

    // seed 1 saved recipe milik user ini, dipakai untuk test get/delete detail
    const seeded = await SavedRecipe.create({
        userId,
        title: 'Nasi Goreng Spesial',
        imageUrl: 'https://spoonacular.com/recipeImages/nasi-goreng.jpg',
        spoonacularId: 654321,
    });
    existingSavedRecipeId = seeded.id;
});

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('SavedRecipes', null, { restartIdentity: true, cascade: true, truncate: true });
    await sequelize.queryInterface.bulkDelete('Users', null, { restartIdentity: true, cascade: true, truncate: true });
});

describe('POST /saved', () => {
    describe('POST /saved - succeed', () => {
        test('7a. jika berhasil, harus return object dengan props message dan data', async () => {
            const body = {
                spoonacularId: 999888,
                title: 'Sup Ayam',
                imageUrl: 'https://spoonacular.com/recipeImages/sup-ayam.jpg',
            };

            const response = await request(app)
                .post('/saved')
                .send(body)
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'succeed saved recipes');
            expect(response.body).toHaveProperty('data', expect.any(Object));
            expect(response.body.data).toHaveProperty('title', body.title);
        });
    });

    describe('POST /saved - failed', () => {
        test('7b. jika gagal (error database), harus return message error', async () => {
            jest.spyOn(SavedRecipe, 'create').mockRejectedValue(new Error('Internal Server Error'));

            const body = {
                spoonacularId: 111222,
                title: 'Gagal Simpan',
                imageUrl: 'https://spoonacular.com/recipeImages/gagal.jpg',
            };

            const response = await request(app)
                .post('/saved')
                .send(body)
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message', expect.any(String));
        });
    });
});

describe('GET /saved', () => {
    describe('GET /saved - succeed', () => {
        test('8a. jika berhasil, harus return array data saved recipes milik user', async () => {
            const response = await request(app)
                .get('/saved')
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});

describe('DELETE /saved/:id', () => {
    describe('DELETE /saved/:id - succeed', () => {
        test('9a. jika berhasil hapus data', async () => {
            const response = await request(app)
                .delete(`/saved/${existingSavedRecipeId}`)
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Recipe removed from saved');
        });
    });

    describe('DELETE /saved/:id - failed', () => {
        test('9b. jika data tidak ditemukan, harus return 404', async () => {
            const response = await request(app)
                .delete('/saved/999999')
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Data Not Found');
        });
    });
});

describe('GET /saved/:id', () => {
    describe('GET /saved/:id - succeed', () => {
        test('10a. jika berhasil, harus return detail recipe dari spoonacular', async () => {
            // buat ulang data saved karena test delete di atas sudah menghapusnya
            const saved = await SavedRecipe.create({
                userId,
                title: 'Rendang Daging Sapi',
                imageUrl: 'https://spoonacular.com/recipeImages/rendang.jpg',
                spoonacularId: 987654,
            });

            const mockDetail = {
                id: 987654,
                title: 'Rendang Daging Sapi',
                image: 'https://spoonacular.com/recipeImages/rendang.jpg',
                readyInMinutes: 120,
                servings: 4,
                summary: 'Rendang khas Minang',
                extendedIngredients: [],
                analyzedInstructions: [],
            };
            jest.spyOn(axios, 'get').mockResolvedValue({ data: mockDetail });

            const response = await request(app)
                .get(`/saved/${saved.id}`)
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', mockDetail.id);
            expect(response.body).toHaveProperty('title', mockDetail.title);
        });
    });
});
