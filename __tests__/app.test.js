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
        return request(app).get('/api/categories')
            .expect(200)
            .then(({ body }) => {
                const categories = body.categories;
                expect(categories.length).toBe(4);
                expect(Array.isArray(categories)).toBe(true);

                categories.forEach(category => {
                    expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    })
                })
            })
    });
});

// TASKS 4 and 7

describe('GET api/reviews/:review_id', () => {
    test('200: returns a complete review for a given id', () => {
        const review_id = 3;
        return request(app)
            .get(`/api/reviews/${review_id}`)
            .expect(200)
            .then(({ body }) => {
                const actualReview = body.review
                expect(typeof actualReview).toBe('object');
                expect(actualReview).toEqual(expect.objectContaining({
                    review_id: review_id,
                    title: 'Ultimate Werewolf',
                    review_body: 'We couldn\'t find the werewolf!',
                    designer: 'Akihisa Okui',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    votes: 5,
                    category: 'social deduction',
                    owner: 'bainesface',
                    created_at: new Date(1610964101251).toISOString(),
                }))
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
    test('404: Message error when review id is not in database', () => {
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
            .then(({ body }) => {
                expect(body.users.length).toBe(4);
                expect(Array.isArray(body.users)).toBe(true);

                body.users.forEach(user => {
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
            .then(body => {
                expect(JSON.parse(body.text)).toEqual({ msg: 'Route not found' })
            })
    })
});

// TASK 8

describe('GET/api/reviews', () => {
    it('200: responds with an object of reviews containing an array sorted by date in descending order', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                const reviews = body.reviews
                expect(reviews.length).toBe(13)
                expect(Array.isArray(reviews)).toBe(true);

                body.reviews.forEach(user => {
                    expect.objectContaining({
                        owner: expect.any(String),
                        title: expect.any(String),
                        review_id: expect.any(Number),
                        category: expect.any(String),
                        review_img_url: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(Number)
                    })
                })
                expect(reviews).toBeSortedBy('created_at', { descending: true })
            })
    })
    it('404: provides a 404 error for an incorrect url', () => {
        return request(app)
            .get('/api/notreviews')
            .expect(404)
            .then(body => {
                expect(JSON.parse(body.text)).toEqual({ msg: 'Route not found' })
            })
    })
});

// TASK 9

describe('GET//api/reviews/:review_id/comments', () => {
    it('200: responds with an object (array) of comments for a given review', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({ body }) => {
                const reviewComments = body
                expect(reviewComments.length).toBe(3);
                expect(Array.isArray(reviewComments)).toBe(true);

                reviewComments.forEach(comment => {
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number)
                    })
                })
            })
    })
    it('404: Returns a 404 error when passed a review id that does not exist', () => {
        return request(app)
            .get('/api/reviews/98765/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Route not found')
            })
    })
    it('400: Returns a 400 error status and message when review_id is invalid', () => {
        return request(app)
            .get('/api/reviews/theidsofmarch/comments')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid input');
            })
    })
    it('200: Returns a 200 when no comments are found for a given review_id', () => {
        return request(app)
            .get('/api/reviews/9/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual([])
            })
    })
})

// TASK 10

describe('POST/api/reviews/:review_id/comments', () => {
    it('201: adds a comment to review_id and responds with the comment', () => {
        const newComment = { username: 'mallionaire', body: 'Yeah, not bad, I guess' };

        return request(app)
            .post('/api/reviews/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toEqual(expect.objectContaining({
                    comment_id: 7,
                    author: 'mallionaire',
                    body: 'Yeah, not bad, I guess',
                    votes: 0,
                    review_id: 1,
                    created_at: expect.any(String)
                }))
            })
    })

    it('201: adds a comment to review_id and responds with the comment', () => {
        const newComment = { username: 'mallionaire', body: 'Yeah, not bad, I guess', hello: 12 };

        return request(app)
            .post('/api/reviews/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.comment.hello).toBe(undefined);
            })
    })

    it('400: Returns "invalid input" when the passed body does not contain both the username and body keys', () => {
        const newComment = { usernaimasdasda: 'mallionaire', bodayasdasd: 'Yeah, not bad, I guess' }
        return request(app)
            .post('/api/reviews/1/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid input');
            })
    })

    it('404: "Resource not found" message provided when username not in database tries to post', () => {
        const newComment = { username: 'mattyG', body: 'I loved it!' }

        return request(app)
            .post('/api/reviews/1/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Resource not found');
            })
    })

    it('400: Returns "Invalid input" when given a non-number as review_id', () => {
        const newComment = { username: 'mallionaire', body: 'Yeah, not bad, I guess' };

        return request(app)
            .post('/api/reviews/jygjvjvh/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid input');
            })
    })

    it('404: "Resource not found" when given number that does not match a review_id', () => {
        const newComment = { username: 'mallionaire', body: 'Yeah, not bad, I guess' };

        return request(app).post('/api/reviews/12345/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) =>
                expect(body.msg).toBe('Resource not found'))
    })

})

// TASK 11

describe('GET/api/reviews?sort_byQUERY1&order=ASC/DESC&category=QUERY3 queries', () => {
    it('200: sorts by descending date by default', () => {

        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                const {reviews} = body;
                expect(reviews.length).toBe(13);
                expect(Array.isArray(reviews)).toBe(true);

                expect(reviews).toBeSortedBy('created_at', { descending: true }
            )
    })
})
    it('200: sorts by date by ascending order when order = ASC is used', () => {

        return request(app)
        .get('/api/reviews?order=ASC')
        .expect(200)
        .then(({ body }) => {
            const {reviews} = body;
            expect(reviews.length).toBe(13);
            expect(Array.isArray(reviews)).toBe(true);

            expect(reviews).toBeSortedBy('created_at')
            // Ascending by default
        })
    })
    it('200: sorts by value used for "sort by" ', () => {
        return request(app)
        .get('/api/reviews?sort_by=owner')
        .expect(200)
        .then(({ body }) => {
            const {reviews} = body;
            expect(reviews.length).toBe(13);
            expect(Array.isArray(reviews)).toBe(true);

            expect(reviews).toBeSortedBy('owner', {descending: true})
        })
    })
    it('200: filters to only show results filtered by category', () => {
        return request(app)
        .get('/api/reviews?category=social%20deduction')
        .expect(200)
        .then(({ body }) => {
            const {reviews} = body;
            expect(reviews.length).toBe(11);
            expect(Array.isArray(reviews)).toBe(true);

            expect(reviews).toBeSortedBy('created_at', {descending: true})
        })
    })
    it('200: handles all queries at once', () => {
        return request(app)
        .get('/api/reviews?sort_by=owner&order=ASC&category=social%20deduction')
        .expect(200)
        .then(( {body}) => {
            const {reviews} = body;
            expect(reviews.length).toBe(11);
            expect(Array.isArray(reviews)).toBe(true);

            expect(reviews).toBeSortedBy('owner');
        })
    })
    it('404: Returns "Invalid input" message for category that doesn\'t exist', () => {
        return request(app)
        .get('/api/reviews?category=blind%20luck')
        .expect(404)
        .then( ({body}) => {
            expect(body.msg).toBe('Invalid input');
        })
    })
    it('400: Returns "Invalid input" for sort_by query that is invalid', () => {
        return request(app)
        .get('/api/reviews?sort_by=randomnotreal')
        .expect(400)
        .then( ({body}) => {
            expect(body.msg).toBe('Invalid input');
        })
    })
    it('400: Returns "Invalid input" for invalid order query', () => {
        return request(app)
        .get('/api/reviews/order=FROMTHEMIDDLE')
        .expect(400)
        .then( ({ body }) => {
            expect(body.msg).toBe('Invalid input');
        })
    })
})

// TASK 12

describe('DELETE/api/comments/:comment_id', () => {
    it('204: removes comment with the given comment_id', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then( () => {
            return request(app)
            .get('/api/reviews/2/comments')})
            .then( ({ body }) => {

                expect(body.length).toBe(2);
            })
    })
    it('404: Returns "Invalid input" if comment_id does not exist', () => {
        return request(app)
        .delete('/api/comments/4567')
        .expect(404)
        .then( ({body}) => {
            expect(body.msg).toBe('This comment doesn\'t exist');
        })
    })
    it('400: Returns "invalid input" if comment_id is not a number', () => {
        return request(app)
        .delete('/api/comments/notactuallyanumber')
        .expect(400)
        .then( ({body}) => {
            expect(body.msg).toBe('Invalid Comment ID!');
        })
    })
})
/*
*/