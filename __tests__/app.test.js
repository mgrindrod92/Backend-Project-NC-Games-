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

describe('GET api/reviews/:review_id', () => {
    test('200: returns a complete review for a given id', () => {
        const review_id = 3;
        return request(app)
        .get(`/api/reviews/${review_id}`)
        .expect(200)
        .then(({ body }) =>  {
            const actualReview = body.review
            expect(typeof actualReview).toBe('object');
            expect(actualReview).toEqual({
                review_id: review_id,
                title: 'Ultimate Werewolf',
                review_body: 'We couldn\'t find the werewolf!',
                designer: 'Akihisa Okui',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                votes: 5,
                category: 'social deduction',
                owner: 'bainesface',
                created_at: new Date(1610964101251).toISOString()
            })
        })
    });
    test('400: Returns a message when passed an invalid review id', () => {
        const review_id = 'notarealreviewnumber'
        return request(app)
        .get('/api/reviews/notarealreviewnumber')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe(`Bad request. ${review_id} is not a valid review id`);
        })
    })
    test('404: Message error when review id is not in database', () => {
        return request(app)
        .get('/api/reviews/123456789')
        .expect(404)
        .then(({ body }) => 
        expect(body.msg).toBe('Not found. This review does not exist'))
    })
})