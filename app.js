const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let data = {
  Student: [
    { id: 1, name: "Alice Smith", city: "New York" },
    { id: 2, name: "Bob Johnson", city: "Los Angeles" },
    { id: 3, name: "Carol Williams", city: "Chicago" }
  ],
  Project: [
    { id: 1, title: "AI Chatbot Development", year: 2023 },
    { id: 2, title: "Web Application Security", year: 2024 },
    { id: 3, title: "Data Analysis Platform", year: 2025 }
  ],
  Students_Projects: [
    { id: 1, student_id: 1, project_id: 1 },
    { id: 2, student_id: 2, project_id: 2 },
    { id: 3, student_id: 3, project_id: 3 }
  ]
};

const getNextId = (entity) => {
  const entities = data[entity];
  return entities.length > 0 ? Math.max(...entities.map(e => e.id)) + 1 : 1;
};

app.get('/api/students', (req, res) => {
  res.json(data.Student);
});

app.get('/api/students/:id', (req, res) => {
  const student = data.Student.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json(student);
});

app.post('/api/students', (req, res) => {
  const { name, city } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!city) return res.status(400).json({ message: "City is required" });
  const newStudent = { id: getNextId('Student'), name, city };
  data.Student.push(newStudent);
  res.status(201).json(newStudent);
});

app.put('/api/students/:id', (req, res) => {
  const student = data.Student.find(s => s.id === parseInt(req.params.id));
  if (!student) return res.status(404).json({ message: "Student not found" });
  const { name, city } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!city) return res.status(400).json({ message: "City is required" });
  student.name = name;
  student.city = city;
  res.json(student);
});

app.delete('/api/students/:id', (req, res) => {
  const index = data.Student.findIndex(s => s.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Student not found" });
  data.Student.splice(index, 1);
  res.status(204).send();
});

app.get('/api/projects', (req, res) => {
  res.json(data.Project);
});

app.get('/api/projects/:id', (req, res) => {
  const project = data.Project.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
});

app.post('/api/projects', (req, res) => {
  const { title, year } = req.body;
  if (!title || !year) return res.status(400).json({ message: "Title and year are required" });
  const newProject = { id: getNextId('Project'), title, year };
  data.Project.push(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const project = data.Project.find(p => p.id === parseInt(req.params.id));
  if (!project) return res.status(404).json({ message: "Project not found" });
  const { title, year } = req.body;
  if (!title || !year) return res.status(400).json({ message: "Title and year are required" });
  project.title = title;
  project.year = year;
  res.json(project);
});

app.delete('/api/projects/:id', (req, res) => {
  const index = data.Project.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Project not found" });
  data.Project.splice(index, 1);
  res.status(204).send();
});

app.get('/api/students-projects', (req, res) => {
  res.json(data.Students_Projects);
});

app.get('/api/students-projects/:id', (req, res) => {
  const sp = data.Students_Projects.find(sp => sp.id === parseInt(req.params.id));
  if (!sp) return res.status(404).json({ message: "Student-Project relation not found" });
  res.json(sp);
});

app.post('/api/students-projects', (req, res) => {
  const { student_id, project_id } = req.body;
  if (!student_id || !project_id) return res.status(400).json({ message: "Student ID and Project ID are required" });
  if (!data.Student.find(s => s.id === student_id)) return res.status(400).json({ message: "Invalid Student ID" });
  if (!data.Project.find(p => p.id === project_id)) return res.status(400).json({ message: "Invalid Project ID" });
  const newSP = { id: getNextId('Students_Projects'), student_id, project_id };
  data.Students_Projects.push(newSP);
  res.status(201).json(newSP);
});

app.put('/api/students-projects/:id', (req, res) => {
  const sp = data.Students_Projects.find(sp => sp.id === parseInt(req.params.id));
  if (!sp) return res.status(404).json({ message: "Student-Project relation not found" });
  const { student_id, project_id } = req.body;
  if (!student_id || !project_id) return res.status(400).json({ message: "Student ID and Project ID are required" });
  if (!data.Student.find(s => s.id === student_id)) return res.status(400).json({ message: "Invalid Student ID" });
  if (!data.Project.find(p => p.id === project_id)) return res.status(400).json({ message: "Invalid Project ID" });
  sp.student_id = student_id;
  sp.project_id = project_id;
  res.json(sp);
});

app.delete('/api/students-projects/:id', (req, res) => {
  const index = data.Students_Projects.findIndex(sp => sp.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Student-Project relation not found" });
  data.Students_Projects.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});