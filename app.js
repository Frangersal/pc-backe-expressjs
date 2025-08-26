// Carga las variables de entorno desde el archivo .en
// Para que nuestra aplicación pueda leer las variables definidas en un archivo .env, necesitamos instalar el paquete dotenv:
// npm install dotenv

require('dotenv').config();
// Importa el módulo express
const express = require('express');
// Crea una instancia de la aplicación express
const app = express();

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
    );
});

// Inicia el servidor y lo pone a escuchar en el puerto definido
app.listen(PORT, () => {
    console.log(`Servidor: http://localhost:${PORT}`);
});