const request = require('supertest');
const app = require('../app');
const axios = require('axios');

afterEach(() => {
    jest.restoreAllMocks();
});

describe('GET /recipes', () => {
    describe('GET /recipes - succeed', () => {
        test('3a. jika berhasil, harus return object dengan props message dan data', async () => {
            const mockSpoonacularResponse = {
                data: {
                    totalResults: 2,
                    results: [
                        { id: 1, title: 'Nasi Goreng Spesial' },
                        { id: 2, title: 'Sate Ayam Madu' },
                    ],
                },
            };

            // mock axios supaya test tidak bergantung pada API eksternal Spoonacular
            jest.spyOn(axios, 'get').mockResolvedValue(mockSpoonacularResponse);

            const response = await request(app).get('/recipes');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'succeed read recipes');
            expect(response.body).toHaveProperty('data', expect.any(Array));
            expect(response.body).toHaveProperty('total', mockSpoonacularResponse.data.totalResults);
            expect(response.body.data).toHaveLength(2);
        });
    });
});
