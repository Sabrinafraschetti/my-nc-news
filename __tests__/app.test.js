const request = require("supertest")
const endpointsJson = require("../endpoints.json");
const app = require("../app")
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection")


beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topics", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
      expect(body.topics.length).toBeGreaterThan(1)
      body.topics.forEach((topic) => {
        expect(typeof topic.slug).toBe("string")
        expect(typeof topic.description).toBe("string")
      })
    })
  })
  test("404: responds with 'Route not found' for invalid endpoint", () => {
    return request(app)
      .get("/api/topic")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article with the corresponding id", () => {
    return request(app)
    .get("/api/articles/1")
    .expect(200)
    .then(({ body }) => {
      expect(body.article).toEqual(
        expect.objectContaining({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
      )
    })
  })
  test("404: Responds with an appropriate status and error message when given a valid but non-existent id ", () => {
    return request(app)
    .get("/api/articles/999")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('article does not exist')
    })
  })
  test("400 sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
    .get("/api/articles/not-an-article")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request')
    })
  })
})
