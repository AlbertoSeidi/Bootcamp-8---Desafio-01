const express = require("express");
const server = express();
server.use(express.json());

//Array de armazenamento
const us = [];
let requisicoes = 0;

function verificaLog(req, res, next) {
  requisicoes++;
  console.log(`Numero de Requisições ${requisicoes}`);
  return next();
}
server.use(verificaLog);

//MIddleware log
server.use((req, res, next) => {
  console.log(`Metodo ${req.method}, URL ${req.url}`);
  return next();
});

function checkId(req, res, next) {
  const { id } = req.params;
  const filterId = us.find(project => project.id == id);
  if (!filterId) {
    res.status(400).json({ error: "Id não encontrado" });
  }
  return next();
}

//Inserir Projeto
server.get("/project", (req, res) => {
  const { id, title } = req.body;

  const info = {
    id,
    title,
    task: []
  };
  us.push(info);
  return res.json(us);
});
//Listando todos os projetos
server.post("/project", (req, res) => {
  return res.json(us);
});
//Alterar projeto
server.put("/project/:id", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const filterProject = us.find(project => project.id == id);
  filterProject.title = title;

  return res.json(us);
});
//Deletar projeto
server.delete("/project/:id", checkId, (req, res) => {
  const { id } = req.params;
  const filterId = us.find(project => project.id == id);
  us.splice(filterId, 1);

  res.send();
});

server.post("/project/:id/task", checkId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const filterId = us.find(project => project.id == id);
  filterId.task.push(title);

  return res.json(us);
});
server.listen(3000);
