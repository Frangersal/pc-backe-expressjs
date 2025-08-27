const errorHandler= (err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || '¡Ocurrió un Error Inesperado!';

    console.error(
        `[ERROR] ${new Date().toISOString()} - ${statusCode} ${message}}`
    );

    // Si tenemos más información del error
    if (err.stack){
        console.error(err.stack);
    }

    // Respuesta JSON con el error
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Mensaje solo en modo desarrollo
        ...err(process.env.NODE_ENV=== 'development' && {stack: err.stack})
    });
    
};

module.exports = errorHandler;