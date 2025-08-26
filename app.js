// Carga las variables de entorno desde el archivo .en
// Para que nuestra aplicación pueda leer las variables definidas en un archivo .env, necesitamos instalar el paquete dotenv:
// npm install dotenv

require('dotenv').config();
// Importa el módulo express
// Se importa body-parser para poder manejar datos enviados en el cuerpo de las peticiones (POST, PUT, etc.)
const express = require('express');
// Importar modulo body-parser
const bodyParser = require('body-parser');
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
    const terms = req.query.termino || 'No especificado';
    const category = req.query.categoria || 'Todas';
    res.send(`
        <h2>Resultados de Busqueda:</h2>
        <p>Término: ${terms}</p>
        <p>Categoría: ${category}</p>
        `)
});

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
});