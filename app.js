// Carga las variables de entorno desde el archivo .en
// Para que nuestra aplicación pueda leer las variables definidas en un archivo .env, necesitamos instalar el paquete dotenv:
// npm install dotenv

require('dotenv').config();
// Importa el módulo express
// Se importa body-parser para poder manejar datos enviados en el cuerpo de las peticiones (POST, PUT, etc.)
const express = require('express');
// Importar modulo body-parser
const bodyParser = require('body-parser');

// Modulos para trabajar con el sistema de archivos y rutas locales
const fs = require('fs');
const path = require('path');
const { serialize } = require('v8');
const { ServerResponse } = require('http');
usersFilePath = path.join(__dirname, 'users.json');



// Crea una instancia de la aplicación express
const app = express();
// Se configura body-parser para aceptar JSON y datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Define el puerto a usar, tomando el valor de la variable de entorno PORT o 3000 por defecto
const PORT = process.env.PORT || 3000;
console.log(PORT)

// Define la ruta principal y la respuesta que se envía al acceder a '/'
app.get('/', (req, res) => {
    res.send(
    `
    <h1>Curso Express.js</h1>
    <p>Esto es una app node.js con express.js </p>
    <p>Corre en el puerto: ${PORT} </p>
    `
// Ruta para mostrar información de un usuario según su ID recibido por parámetro en la URL
    );
});

app.get('/users/:id',(req, res)=>{
// Ruta para realizar búsquedas usando parámetros de consulta (query params)
    const userId = req.params.id;
    res.send(`Mostrar información del usuario con ID: ${userId}`)
});
app.get('/search', (req,res)=>{
// Ruta que permite realizar búsquedas utilizando parámetros de consulta (query string) recibidos en la URL
// Ej. http://localhost:3005/search?termino=expressjs&categoria=nodejs
const terms = req.query.termino || 'No especificado';
    const category = req.query.categoria || 'Todas';
    res.send(`
        <h2>Resultados de Busqueda:</h2>
        <p>Término: ${terms}</p>
        <p>Categoría: ${category}</p>
        `)
});

//Ruta para pocesar formularios
app.post('/form',(req, res)=> {
    //Accederemos a los datos en el BODY de la peticion
    // Si probamos en URL no podremos verlo en el navegador 
    // Usaremos Postman
    const name = req.body.nombre || 'Anónimo'
    const email = req.body.email || 'No proporcionado'
    res.json({
        message: 'Datos recibidos', 
        data: {
            name, 
            email
        }
    })

});
// Ruta para recibir datos JSON mediante una petición POST y responder con los datos recibidos o un error si no se envían datos
app.post('/api/data', (req, res)=>{
    const data = req.body;
    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({error: 'No se recibieron datos'})
    }

    res.status(201).json({
        message:'Datos JSON recibidos',
        data
    })
});

// CRUD - R of Read!
app.get('/users', (req, res)=>{
    fs.readFile(usersFilePath, 'utf-8', (err, data)=>{
        if(err){
            return res.status(500).json({error:'Error con conexión de datos.'})
        }

        const users= JSON.parse(data);
        res.json(users);
    })
});

// CRUD - C of Create!
app.post('/users', (req, res) => {
    // Se obtiene el nuevo usuario desde el body
    const newUser = req.body;

    // Validación del nombre
    if (!newUser.name || newUser.name.length < 3) {
        return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres" });
    }

    // Validación del email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!newUser.email || !emailRegex.test(newUser.email)) {
        return res.status(400).json({ error: "El email no es válido" });
    }

    // Leer usuarios actuales y validar que el ID sea único, además de generar un ID automáticamente
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos.' });
        }
        let users = [];
        try {
            users = JSON.parse(data);
        } catch (e) {
            users = [];
        }

        // Generar un ID único automáticamente como número usando timestamp y aleatorio
        const newId = Date.now() * 10000 + Math.floor(Math.random() * 10000);

        // Validar que el email no esté repetido (opcional, pero recomendable)
        if (users.some(u => u.email === newUser.email)) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Asignar el ID generado automáticamente como número y crear el objeto con id primero
        const userToSave = {
            id: Number(newId),
            name: newUser.name,
            email: newUser.email
        };
        users.push(userToSave);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).json({ error: 'Error al guardar el usuario' });
            }
            res.status(201).json(userToSave);
        });
    });
});

// CRUD - U of Update!
app.put('/users/:id', (req, res)=>{
    const userId = parseInt(req.params.id, 10)
    const updatedUser = req.body;
    // Validar que no se está intentando modificar el campo 'id'
    if ('id' in updatedUser) {
        return res.status(400).json({ error: 'No se puede modificar el campo id.' });
    }
    // Validar formato de datos enviados
    if (updatedUser.name && updatedUser.name.length < 3) {
        return res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres.' });
    }
    if (updatedUser.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updatedUser.email)) {
            return res.status(400).json({ error: 'El email no es válido.' });
        }
    }
    // Leer el archivo de usuarios
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error con conexión de datos.' });
        }
        let users = [];
        try {
            users = JSON.parse(data);
        } catch (e) {
            users = [];
        }
        // Verificar que no existan IDs duplicados
        const idCount = users.filter(u => u.id === userId).length;
        if (idCount > 1) {
            return res.status(400).json({ error: 'Existen IDs duplicados en la base de datos.' });
        }
        // Verificar que el ID existe
        const userIndex = users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        // Actualizar solo el primer usuario encontrado
        users[userIndex] = { ...users[userIndex], ...updatedUser };
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).json({ error: "Error al actualizar el usuario" });
            }
            res.json(users[userIndex]);
        });
    });
});


// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
});