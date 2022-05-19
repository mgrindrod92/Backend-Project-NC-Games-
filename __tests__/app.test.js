process.env.NODE_ENV = 'test';

const db = require('../db/connection.js');

const request = require('supertest');
// const pg = require('pg');
// const format = require('pg-format');
// require('jest');
require('jest-sorted');

const seed = require('../db/seeds/seed');
const app = require('../app');
const testData = require('../db/data/test-data');

beforeEach(() => {
    return seed(testData);
})

afterAll(() => {
    return db.end()
});

// TASK 3

describe('GET api/notcategories', () => {
    it('provides a 404 error for an incorrect url', () => {
        return request(app)
            .get('/api/notcategories')
            .expect(404)
    });
})

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
});

// TASK 4 and 7

describe('GET api/reviews/:review_id', () => {
    test('200: returns a complete review for a given id', () => {
        const review_id = 3;
        return request(app)
            .get(`/api/reviews/${review_id}`)
            .expect(200)
            .then(({ body }) => {
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
                    created_at: new Date(1610964101251).toISOString(),
                    comment_count: expect.any(Number)
                })
            })
    });
    test('400: Returns a message when passed an invalid review id', () => {
        const review_id = 'notarealreviewnumber'
        return request(app)
            .get('/api/reviews/notarealreviewnumber')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe(`Invalid input`);
            })
    })
    test.only('404: Message error when review id is not in database', () => {
        return request(app)
            .get('/api/reviews/123456789')
            .expect(404)
            .then(({ body }) =>
                expect(body.msg).toBe('Not found. This review does not exist'))
    })
    test('200: returns a complete review for a given id with comment count added', () => {
        const review_id = 3;
        const testReview = {
            review_id: review_id,
            title: 'Ultimate Werewolf',
            review_body: 'We couldn\'t find the werewolf!',
            designer: 'Akihisa Okui',
            review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
            votes: 5,
            category: 'social deduction',
            owner: 'bainesface',
            created_at: new Date(1610964101251).toISOString(),
            comment_count: 3
        }
        return request(app)
            .get(`/api/reviews/${review_id}`)
            .expect(200)
            .then(({ body }) => {
                const actualReview = body.review
                expect(typeof actualReview).toBe('object');
                expect(actualReview).toEqual(testReview)
            })
    });
})

// TASK 5

describe('PATCH api/reviews/:review_id', () => {
    const review = {
        review_id: 9,
        title: 'A truly Quacking Game; Quacks of Quedlinburg',
        category: 'social deduction',
        designer: 'Wolfgang Warsch',
        owner: 'mallionaire',
        review_body: "Ever wish you could try your hand at mixing potions? Quacks of Quedlinburg will have you mixing up a homebrew like no other. Each player buys different ingredients (chips) that are drawn at random to reach the most points, but watch out, you'd better not let your cauldrom explode.",
        review_img_url: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        created_at: '2021-01-18T10:01:41.251Z',
        votes: 20
    }
    test("200: returns a 200 status with the initial review", () => {
        return request(app)
            .patch('/api/reviews/9')
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
                expect(typeof body).toBe('object');
                expect(body.review).toEqual(review);
            })
    })
    test('200: returns an updated review (with the new number of votes)', () => {
        return request(app)
            .patch(`/api/reviews/9`)
            .send({ inc_votes: 10 })
            .expect(200)
            .then(({ body }) => {
                expect(body.review.votes).toBe(20);
            })
    })
    test('200: returns an updated review when passed a negative number of votes', () => {
        return request(app)
            .patch(`/api/reviews/1`)
            .send({ inc_votes: -2 })
            .then(({ body }) => {
                expect(body.review.votes).toBe(-1);
            })
    })
    test('404: Returns an error status when passed a review id that doesn\'t exist', () => {
        return request(app)
            .patch('/api/reviews/345')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) =>
                expect(body.msg).toBe('No review found with this review id'))
    })
    test('400: Returns an error status and message when review_id is invalid', () => {
        const review_id = 'notavalidid'
        return request(app)
            .patch('/api/reviews/notavalidid')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe(`Invalid input`)
            })
    })
    test('400: Returns an error status and message when inc_votes is invalid', () => {
        return request(app)
            .patch('/api/reviews/5')
            .send({ inc_votes: 'more votes please' })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid input')
            })
    })
})

// TASK 6

describe('GET /api/users', () => {
    it('200: returns a list of users with the correct format', () => {

        return request(app)
            .get('/api/users')
            .expect(200)
            .then(res => {
                expect(res.body.users.length).toBe(4);
                expect(Array.isArray(res.body.users)).toBe(true);

                res.body.users.forEach(user => {
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    })
                })
            })
        })

        it('404: provides a 404 error for an incorrect url', () => {
            return request(app).
                get('/api/notusers')
                .expect(404)
                .then( body => {
                    expect(JSON.parse(body.text)).toEqual({msg: 'Route not found'})
                })
        })
    });

    // TASK 8
