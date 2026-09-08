
jest.mock('@google/genai', () => {
    const mockGenerateContent = jest.fn();
    const MockGoogleGenAI = jest.fn().mockImplementation(() => ({
        models: {
            generateContent: mockGenerateContent,
        },
    }));
    return { GoogleGenAI: MockGoogleGenAI, __mockGenerateContent: mockGenerateContent };
});

const request = require('supertest');
const app = require('../app');
const axios = require('axios');
const { sequelize } = require('../models');
const { hashPW } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { __mockGenerateContent: mockGenerateContent } = require('@google/genai');

let acc_token;

beforeAll(async () => {
    const data = require('../data/users.json');
    const seedData = data.map((el) => ({
        ...el,
        password: hashPW(el.password),
        createdAt: new Date(),
        updatedAt: new Date(),
    }));

    await sequelize.queryInterface.bulkInsert('Users', seedData, {});

    acc_token = signToken({
        id: 1,
        email: 'budi@example.com',
        name: 'Budi Santoso',
    });
});

afterEach(() => {
    jest.restoreAllMocks();
    mockGenerateContent.mockReset();
});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete('Users', null, { restartIdentity: true, cascade: true, truncate: true });
});

describe('POST /ai/recipes', () => {
    describe('POST /ai/recipes - succeed', () => {
        test('4a. jika berhasil dengan source spoonacular', async () => {
            const spoonacularRecipes = [
                { id: 1, title: 'Telur Dadar', usedIngredientCount: 2 },
                { id: 2, title: 'Nasi Telur', usedIngredientCount: 2 },
            ];
            jest.spyOn(axios, 'get').mockResolvedValue({ data: spoonacularRecipes });

            const response = await request(app)
                .post('/ai/recipes')
                .send({ ingredients: ['telur', 'nasi'] })
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('source', 'spoonacular');
            expect(response.body).toHaveProperty('message', expect.any(String));
            expect(response.body).toHaveProperty('data', expect.any(Array));
        });

        test('4b. jika berhasil dengan source gemini', async () => {
            // usedIngredientCount rendah -> tidak ada recipe spoonacular yang cocok -> fallback ke gemini
            const spoonacularRecipes = [{ id: 1, title: 'Recipe Tidak Cocok', usedIngredientCount: 0 }];
            jest.spyOn(axios, 'get').mockResolvedValue({ data: spoonacularRecipes });

            const geminiRecipe = {
                title: 'Tumis Telur Sederhana',
                readyInMinutes: 15,
                servings: 2,
                ingredients: [{ name: 'telur', amount: 2, unit: 'butir' }],
                instructions: ['Kocok telur', 'Goreng hingga matang'],
            };
            mockGenerateContent.mockResolvedValue({ text: JSON.stringify(geminiRecipe) });

            const response = await request(app)
                .post('/ai/recipes')
                .send({ ingredients: ['telur'] })
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('source', 'gemini');
            expect(response.body).toHaveProperty('message', expect.any(String));
            expect(response.body).toHaveProperty('data', expect.any(Object));
            expect(response.body.data).toHaveProperty('title', geminiRecipe.title);
        });
    });

    describe('POST /ai/recipes - failed', () => {
        test('4c. jika tidak mengisi ingredients, harus return error', async () => {
            const response = await request(app)
                .post('/ai/recipes')
                .send({})
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', expect.any(String));
        });
    });
});

describe('POST /recipes/photo', () => {
    describe('POST /recipes/photo - succeed', () => {
        test('5a. jika berhasil, ingredient terdeteksi dan recipe ditemukan', async () => {
            // panggilan pertama generateContent = deteksi bahan dari foto
            mockGenerateContent.mockResolvedValueOnce({
                text: JSON.stringify({ ingredients: ['ayam', 'bawang'] }),
            });

            const spoonacularRecipes = [
                { id: 1, title: 'Ayam Bawang', usedIngredientCount: 2 },
            ];
            jest.spyOn(axios, 'get').mockResolvedValue({ data: spoonacularRecipes });

            const response = await request(app)
                .post('/recipes/photo')
                .set('Authorization', `Bearer ${acc_token}`)
                .attach('photo', Buffer.from('fake-image-content'), 'ingredients.jpg');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', expect.any(String));
            expect(response.body).toHaveProperty('data', expect.any(Array));
        });
    });

    describe('POST /recipes/photo - failed', () => {
        test('5b. jika tidak mengirim foto, harus return error', async () => {
            const response = await request(app)
                .post('/recipes/photo')
                .set('Authorization', `Bearer ${acc_token}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', expect.any(String));
        });

        test('5c. jika foto dikirim tapi tidak ada ingredient terdeteksi', async () => {
            mockGenerateContent.mockResolvedValueOnce({
                text: JSON.stringify({ ingredients: [] }),
            });

            const response = await request(app)
                .post('/recipes/photo')
                .set('Authorization', `Bearer ${acc_token}`)
                .attach('photo', Buffer.from('fake-image-content'), 'blank.jpg');

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', expect.any(String));
        });
    });
});
