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

// Función para leer cursos desde el archivo JSON
const readCoursesFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'courses.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

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
    const requiredFields = ['nombre', 'descripcion', 'fecha_objetivo', 'estado'];
    for (const field of requiredFields) {
        if (!course[field]) {
            return `${field} es requerido`;
        }
    }
    const validStates = ['No iniciado', 'En progreso', 'Completado'];
    if (!validStates.includes(course.estado)) {
        return 'Estado inválido. Los valores válidos son: "No iniciado", "En progreso" o "Completado".';
    }
    return null;
};

// Endpoint para agregar un nuevo curso
app.post('/api/courses', (req, res) => {
    const newCourse = req.body;
    const validationError = validateCourse(newCourse);

    if (validationError) {
        return res.status(400).json({ error: validationError }); // Manejo de errores de validación
    }

    const courses = readCoursesFromFile();
    const id = courses.length > 0 ? Math.max(courses.map(c => c.id)) + 1 : 1; // Generar ID automáticamente
    const createdAt = new Date().toISOString();

    const courseToSave = { id, creado_en: createdAt, ...newCourse };
    courses.push(courseToSave);
    writeCoursesToFile(courses);

    res.status(201).json(courseToSave); // Devuelve el nuevo curso
});

// Endpoint para obtener todos los cursos
app.get('/api/courses', (req, res) => {
    const courses = readCoursesFromFile();
    res.json(courses);
});

// Endpoint para obtener un curso específico
app.get('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courses = readCoursesFromFile();
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
        return res.status(404).json({ error: 'Curso no encontrado' }); // Manejo de errores si no se encuentra el curso
    }
    
    res.json(course);
});

// Endpoint para actualizar un curso
app.put('/api/courses/:id', (req, res) => {
    const courseId = parseInt(req.params.id);
    const courses = readCoursesFromFile();
    const index = courses.findIndex(c => c.id === courseId);

    if (index === -1) {
        return res.status(404).json({ error: 'Curso no encontrado' }); // Manejo de errores si no se encuentra el curso
    }

    const updatedCourse = { ...courses[index], ...req.body };
    const validationError = validateCourse(updatedCourse); // Validar campos requeridos

    if (validationError) {
        return res.status(400).json({ error: validationError }); // Manejo de errores de validación
    }

    courses[index] = updatedCourse;
    writeCoursesToFile(courses);

    res.json(updatedCourse); // Devuelve el curso actualizado
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