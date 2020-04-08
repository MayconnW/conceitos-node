const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = { id: uuid(), url, title, techs, likes: 0 };
  repositories.push(repo);

  return response.json(repo);
});

const mid = (req, res, next) => {
  const { id } = req.params;
  if (!isUuid(id)) return res.status(400).send();
  const repoIndex = repositories.findIndex((item) => item.id === id);
  if (repoIndex === -1) return res.status(400).send();

  req.repoIndex = repoIndex;
  return next();
};

app.delete("/repositories/:id", mid, (req, res) => {
  repositories.splice(req.repoIndex, 1);
  return res.status(204).send();
});

app.put("/repositories/:id", mid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const likes = repositories[request.repoIndex].likes;
  const repo = { id, title, url, techs, likes };

  repositories[request.repoIndex] = repo;
  return response.json(repo);
});

app.post("/repositories/:id/like", mid, (request, response) => {
  const { id } = request.params;
  repositories[request.repoIndex].likes += 1;
  return response.json({ likes: repositories[request.repoIndex].likes });
});

module.exports = app;
