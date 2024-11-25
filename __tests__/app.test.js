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
