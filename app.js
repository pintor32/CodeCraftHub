const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Puerto donde se ejecutará la aplicación

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(express.json());

// Middleware CORS para permitir llamadas desde el frontend de Vite
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        return res.sendStatus(200);
    }
    next();
});

// Función para leer cursos desde el archivo JSON
const readCoursesFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Normaliza los datos del curso para la API usando nombres en inglés
const normalizeCourseForApi = (course) => ({
    id: course.id,
    name: course.name || course.nombre || '',
    description: course.description || course.descripcion || '',
    target_date: course.target_date || course.fecha_objetivo || '',
    status: course.status || course.estado || '',
    created_at: course.created_at || course.creado_en || ''
});

// Función para escribir cursos en el archivo JSON
const writeCoursesToFile = (courses) => {
    fs.writeFileSync(path.join(__dirname, 'courses.json'), JSON.stringify(courses, null, 2));
};

// Comprobar si el archivo courses.json existe, si no, lo crea
if (!fs.existsSync(path.join(__dirname, 'courses.json'))) {
    writeCoursesToFile([]); // Crea el archivo inicializado como un arreglo vacío
}

// Middleware para validar campos requeridos
const validateCourse = (course) => {
    const requiredFields = ['name', 'description', 'target_date', 'status'];
    for (const field of requiredFields) {
        if (!course[field]) {
            return `${field} is required`;
        }
    }
    const validStates = ['Not Started', 'In Progress', 'Completed'];
    if (!validStates.includes(course.status)) {
        return 'Invalid status. Valid values are: "Not Started", "In Progress" or "Completed".';
    }
    return null;
};

// Endpoint para agregar un nuevo curso
app.post('/api/courses', (req, res) => {
    const newCourse = req.body;
    const validationError = validateCourse(newCourse);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const courses = readCoursesFromFile();
    const id = courses.length > 0 ? Math.max(courses.map(c => c.id)) + 1 : 1;
    const createdAt = new Date().toISOString();

    const courseToSave = { id, created_at: createdAt, ...newCourse };
    courses.push(courseToSave);
    writeCoursesToFile(courses);

    res.status(201).json(normalizeCourseForApi(courseToSave));
});

// Endpoint para obtener todos los cursos
app.get('/api/courses', (req, res) => {
    const courses = readCoursesFromFile();
    res.json(courses.map(normalizeCourseForApi));
});

// Endpoint para obtener un curso específico
app.get('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courses = readCoursesFromFile();
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(normalizeCourseForApi(course));
});

// Endpoint para actualizar un curso
app.put('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courses = readCoursesFromFile();
    const index = courses.findIndex(c => c.id === courseId);

    if (index === -1) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const existingCourse = normalizeCourseForApi(courses[index]);
    const updatedCourse = { id: courseId, created_at: existingCourse.created_at, ...existingCourse, ...req.body };
    const validationError = validateCourse(updatedCourse);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    courses[index] = updatedCourse;
    writeCoursesToFile(courses);

    res.json(normalizeCourseForApi(updatedCourse));
});

// Endpoint para eliminar un curso
app.delete('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courses = readCoursesFromFile();
    const index = courses.findIndex(c => c.id === courseId);

    if (index === -1) {
        return res.status(404).json({ error: 'Curso no encontrado' }); // Manejo de errores si no se encuentra el curso
    }

    courses.splice(index, 1); // Elimina el curso del arreglo
    writeCoursesToFile(courses);

    res.status(204).send(); // Devuelve un estado 204 No Content
});