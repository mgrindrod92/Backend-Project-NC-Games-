process.env.NODE_ENV = 'test';

const db = require('../db/connection.js');

const request = require('supertest');
const pg = require('pg');
const format = require('pg-format');
// require('jest');
// require('jest-sorted');

const seed = require('../db/seeds/seed');
const app = require('../app');

const testData = require('../db/data/test-data');
const res = require('express/lib/response');

beforeEach(() => {
    return seed(testData);
})

afterAll(() => {
    return db.end()
});

describe('GET api/categories', () => {
    it('200: returns a list of categories of games with the correct format', () => {
        return request(app).get('/api/categories').expect(200).then(res => {
            expect(res.body.categories.length).toBe(4);
            expect(Array.isArray(res.body.categories)).toBe(true);

            res.body.categories.forEach(category => {
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
            })
        })
    });
    it('provides a 404 error for an incorrect url', () => {
        return request(app).get('/api/notcategories').expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Route not found')
        });
    });
});

describe.only('GET api/reviews/:review_id', () => {
    (test('200: returns a complete review for a given id', () => {
        const review_id = 3;
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body }) =>  {
            const actualReview = body.rows[0]
            expect(typeof actualReview).toBe(object);
            expect(actualReview).toEqual({
                review_id: reviewId,
                title: 1,
                review_body: 1,
                designer: 1,
                review_img_url: 1,
                votes: 1,
                category: 1,
                owner: 1,
                created_at: convertTimestampToDate
            })
        })
    }));
})