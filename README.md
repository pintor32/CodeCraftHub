# CodeCraftHub

## Descripción del proyecto
CodeCraftHub es una API REST diseñada para ayudar a los desarrolladores a hacer seguimiento de sus objetivos de aprendizaje personal. Permite gestionar cursos que un usuario desea completar, incluyendo detalles como el nombre del curso, la fecha objetivo de finalización, el estado actual y la descripción del curso.

## Características
- Operaciones CRUD para gestionar cursos.
- Almacenamiento de datos en un archivo JSON.
- Validación de campos requeridos y manejo de errores.
- Endpoints para obtener, agregar, actualizar y eliminar cursos.

## Instrucciones de instalación
1. Clona este repositorio o descarga el ZIP.
2. Abre una terminal y navega a la carpeta del proyecto.
3. Ejecuta el siguiente comando para instalar las dependencias:
   ```bash
   npm install
Cómo ejecutar la aplicación
Para iniciar la aplicación, ejecuta el siguiente comando en la terminal:

npm start
Esto iniciará el servidor en
http://localhost:5000
.

Documentación de los endpoints de la API
1. Agregar un nuevo curso
POST
/api/courses

Body (JSON):

{
    "nombre": "Curso de JavaScript",
    "descripcion": "Aprender los conceptos básicos de JavaScript.",
    "fecha_objetivo": "2023-12-31",
    "estado": "No iniciado"
}

Respuesta: 201 Created (JSON):

{
    "id": 1,
    "creado_en": "2023-10-15T12:00:00.000Z",
    "nombre": "Curso de JavaScript",
    "descripcion": "Aprender los conceptos básicos de JavaScript.",
    "fecha_objetivo": "2023-12-31",
    "estado": "No iniciado"
}

2. Obtener todos los cursos

GET
/api/courses

Respuesta: 200 OK (JSON):

[
    {
        "id": 1,
        "creado_en": "2023-10-15T12:00:00.000Z",
        "nombre": "Curso de JavaScript",
        "descripcion": "Aprender los conceptos básicos de JavaScript.",
        "fecha_objetivo": "2023-12-31",
        "estado": "No iniciado"
    }
]

3. Obtener un curso específico

GET
/api/courses/:id

Ejemplo:
/api/courses/1

Respuesta: 200 OK (JSON):

{
    "id": 1,
    "creado_en": "2023-10-15T12:00:00.000Z",
    "nombre": "Curso de JavaScript",
    "descripcion": "Aprender los conceptos básicos de JavaScript.",
    "fecha_objetivo": "2023-12-31",
    "estado": "No iniciado"
}

Respuesta: 404 Not Found si el curso no se encuentra.

4. Actualizar un curso
PUT
/api/courses/:id
Ejemplo:
/api/courses/1

Body (JSON):

{
    "estado": "En progreso"
}
Respuesta: 200 OK (JSON):
{
    "id": 1,
    "creado_en": "2023-10-15T12:00:00.000Z",
    "nombre": "Curso de JavaScript",
    "descripcion": "Aprender los conceptos básicos de JavaScript.",
    "fecha_objetivo": "2023-12-31",
    "estado": "En progreso"
}

Respuesta: 404 Not Found si el curso no se encuentra.

5. Eliminar un curso
DELETE
/api/courses/:id

Ejemplo:
/api/courses/1

Respuesta: 204 No Content al eliminar exitosamente el curso.
Respuesta: 404 Not Found si el curso no se encuentra.

Solución de problemas
Error: Curso no encontrado: Asegúrate de que estás utilizando un ID válido para los cursos.
Error: Campo requerido faltante: Ver
