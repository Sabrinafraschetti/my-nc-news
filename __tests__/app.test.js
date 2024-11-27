const request = require("supertest")
const endpointsJson = require("../endpoints.json");
const app = require("../app")
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection")
require("jest-sorted")


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
  test("400: sends an appropriate status and error message when given an invalid id", () => {
    return request(app)
    .get("/api/articles/not-an-article")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request')
    })
  })
})

describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).toBeGreaterThan(1)
      body.articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          author: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String),
        })
      })
    })
  })
  test("200: Articles are sorted by date in descending order by defult", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Articles are sorted by date in ascending order when specified", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("200: Responds with articles filtered by author", () => {
    return request(app)
      .get("/api/articles?author=butter_bridge")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.author).toBe("butter_bridge");
        })
      })
  })
  test("200: Responds with articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });     
  })
  test("200: Responds with articles that accept multiple queries", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("200: Responds with an empty array when no articles match the author filter", () => {
    return request(app)
    .get("/api/articles?author=lurker")
    .expect(200)
    .then(({ body }) => {
      expect(body.articles).toEqual([])
    })
  })
  test("404: Responds with an appropriate status and error message when given a valid but non-existent author", () => {
    return request(app)
      .get("/api/articles?author=non-existant-author")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: Responds with an appropriate status and error message when given an invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=not-a-column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an appropriate status and error message when given an invalid order value", () => {
    return request(app)
      .get("/api/articles?order=invalid-order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of all the comments for the given article_id", () => {
    return request(app)
    .get("/api/articles/1/comments")
    .expect(200)
    .then(({ body }) => {
      expect(body.comments.length).toBeGreaterThan(1)
      body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: expect.any(Number),
        })
      })
    })
  })
  test("200: Comments are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: Responds with an empty array when there are no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("404: Responds with an appropriate status and error message when given a valid but non-existent article_id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("400: Responds with an appropriate status and error message when given an invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=not-a-column")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("400: Responds with an appropriate status and error message when given an invalid order value", () => {
    return request(app)
      .get("/api/articles?order=invalid-order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
    })
  });

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment", () => {

    const newComment = {
      username: "butter_bridge",
      body: "this is a new comment"
    }
    return request(app)
    .post("/api/articles/1/comments")
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
      expect(body.comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: "butter_bridge",
          body: "this is a new comment",
          article_id: 1
        })
      )
   })
 })
 test('400: Responds with an error when request body is empty', () => {
  return request(app)
    .post('/api/articles/1/comments')
    .send({})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request');
    });
});
test('400: Responds with an error when "username" is missing', () => {
  const newComment = { body: 'this is a new comment' };

  return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request');
    });
});
test('400: Responds with an error when "body" is missing', () => {
  const newComment = { username: 'butter_bridge' };

  return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request');
    });
});
test('400: Responds with an appropriate status and error message when given an invalid id', () => {
  const newComment = {
    username: 'butter_bridge',
    body: 'this is a new comment',
  };

  return request(app)
    .post('/api/articles/not-an-article/comments')
    .send(newComment)
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad request');
    });
});
test('404: Responds with an appropriate status and error message when given a valid but non-existent article_id', () => {
  const newComment = {
    username: 'butter_bridge',
    body: 'this is a new comment',
  };

  return request(app)
    .post('/api/articles/9999/comments') 
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Article not found');
    });
});
test('404: Responds with an error when "username" does not exist', () => {
  const newComment = {
    username: 'newUser',
    body: 'this is a new comment',
  };

  return request(app)
    .post('/api/articles/1/comments')
    .send(newComment)
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe('Not found');
    });
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with patched article", () => {
    const updatedArticle = { inc_votes: 1 }
    
    return request(app)
    .patch("/api/articles/1")
    .send(updatedArticle)
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
          votes: 101,
          article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        })
      )
    })
  })
  test('200: Responds with patched article when a negative inc_votes value is provided', () => {
    const newVote = { inc_votes: -10 };

    return request(app)
      .patch(`/api/articles/1`)
      .send(newVote)
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
            votes: 90,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        )
      })
  });
  test('404: Responds with an appropriate status and error message if the article_id does not exist', () => {
    const newVote = { inc_votes: 5 };

    return request(app)
      .patch(`/api/articles/999`)
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article not found');
      });
  });
  test('400:  Responds with an appropriate status and error message if the request body does not contain the inc_votes property', () => {
    const newVote = {}; 

    return request(app)
      .patch(`/api/articles/1`)
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
  test('400: Responds with an appropriate status and error message if inc_votes is not a valid number', () => {
    const invalidVote = { inc_votes: 'invalid' }

    return request(app)
      .patch(`/api/articles/1`)
      .send(invalidVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
})

describe("DELETE /api/comments/comment_id", () => {
  test("204: Responds with no content and deleted comment by id", () => {
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  })
  test('404: Responds with an error when comment_id does not exist', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Comment not found');
      })
  })
  test('400: Responds with an error when comment_id is invalid', () => {
    return request(app)
      .delete('/api/comments/not-a-comment')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      })
  })
})

describe("GET /api/users", () => {
  test("200: Responds with an array of all the users", () => {
    return request(app) 
    .get("/api/users")
    .expect(200)
    .then(({ body }) => {
      expect(body.users.length).toBeGreaterThan(1)
      body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        })
      })
    })
  })
  test("404: responds with 'Route not found' for invalid endpoint", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      })
  })
})