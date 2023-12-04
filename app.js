const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path'); // Agrega esta línea para utilizar el módulo 'path'
const session = require('express-session');

const app = express();
const port = 3000;
app.use(session({
          secret: 'fatama1', // Cambia esto a una cadena de caracteres más segura en un entorno de producción
          resave: false,
          saveUninitialized: true,
}));

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: 'admin',
          database: 'formBase',
});

db.connect((err) => {
          if (err) {
                    console.error('Error al conectar a la base de datos:', err);
          } else {
                    console.log('Conexión exitosa a la base de datos');
          }
});

// Middleware para parsear los datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para imprimir en la consola los datos del formulario
app.use((req, res, next) => {
          console.log('Datos del formulario:', req.body);
          next();
});

// Middleware para servir archivos estáticos desde la carpeta /public
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
          res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/form', (req, res) => {
          res.sendFile(path.join(__dirname, '/public/pages/form.html'));
});
app.get('/login', (req, res) => {
          res.sendFile(path.join(__dirname, '/public/pages/login.html'));
}); app.get('/session', (req, res) => {
          res.sendFile(path.join(__dirname, '/public/pages/session.html'));
});

// Ruta para manejar la solicitud POST del formulario
app.post('/enviar-form', (req, res) => {
          const { Carrera, Nombres, Apellidos, DNI, FechaNacimiento, CorreoInstitucional, Contrasena } = req.body;

          // Insertar datos en la base de datos, incluyendo la fecha de registro
          const sql = 'INSERT INTO usuarios (carrera, nombres, apellidos, dni, fecha_nacimiento, correo_institucional, contrasena, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)';
          const values = [Carrera, Nombres, Apellidos, DNI, FechaNacimiento, CorreoInstitucional, Contrasena];

          db.query(sql, values, (err, result) => {
                    if (err) {
                              console.error('Error al insertar datos en la base de datos:', err);
                              res.status(500).send('Error interno del servidor');
                    } else {
                              console.log('Datos insertados correctamente');
                              // Enviar una respuesta con un mensaje indicando el éxito
                              res.status(200).send('Registro exitoso');
                    }
          });
});

// Ruta para manejar la solicitud POST del formulario de login
app.post('/login', (req, res) => {
          const { CorreoInstitucional, Contrasena } = req.body;

          const sql = 'SELECT * FROM usuarios WHERE correo_institucional = ? AND contrasena = ?';
          const values = [CorreoInstitucional, Contrasena];

          db.query(sql, values, (err, results) => {
                    if (err) {
                              console.error('Error al realizar la consulta:', err);
                              res.status(500).send('Error interno del servidor');
                    } else {
                              if (results.length > 0) {
                                        // Usuario autenticado, almacenar información en la sesión
                                        req.session.user = results[0];
                                        res.status(200).send('Login exitoso');
                              } else {
                                        // Credenciales incorrectas
                                        res.status(401).send('Credenciales incorrectas');
                              }
                    }
          });
});


// Iniciar el servidor
app.listen(port, () => {
          console.log(`Servidor Express escuchando en el puerto ${port}`);
});
