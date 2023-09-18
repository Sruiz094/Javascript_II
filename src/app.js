const express = require("express"); //Agregamos express a nuestro proyecto
const mongoose = require("mongoose"); //Agregamos mogoose a nuestro proyecto
require("dotenv").config(); //requerir dotenv para poder accesar variables de ambiente creadas por nosotros
const app = express(); //Ejecutamos express

app.use(express.json()); //middleware lee los datos Json y los convierte en un objeto JavaScript

// Conexión a MongoDB AtlSas
const mongoUri = process.env.MONGODB_URI; //Uri de mongodb atlas traida desde .env

//Conexión a la base de datos en mogodb atlas a travez de mongoose
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true, // Utiliza el nuevo parser de cadena de conexión
    useUnifiedTopology: true, // Utiliza el nuevo motor de monitoreo y administración de conexiones unificado
  })
  .then(() => {
    console.log("Conectado a MongoDB");
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
  });

// Obtiene una referencia a la conexión con la base de datos
const db = mongoose.connection;

// Escucha el evento "error" en la conexión. Si ocurre un error, lo mostrará en la consola.
db.on("error", console.error.bind(console, "Error de conexión:"));

// Escucha el evento "open", el cual se activa una vez que la conexión con MongoDB ha sido establecida exitosamente.
db.once("open", () => {
  console.log("Conectado a MongoDB");
});

// Define un esquema para el modelo Libro.
// El esquema determina la estructura de los documentos en la colección de MongoDB.
// En este caso, cada libro tendrá un título y un autor, ambos de tipo String.
const TareaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  aprobacion: Boolean,
});

// Crea un modelo llamado "Libro" utilizando el esquema definido anteriormente.
// Con este modelo, puedes realizar operaciones CRUD sobre la colección de libros en la base de datos.
// Mongoose creará o utilizará una colección llamada "libros" (versión pluralizada del nombre del modelo) en la base de datos.
const Tarea = mongoose.model("Tarea", TareaSchema);

 //Middleware de autenticación
app.use((req, res, next) => {
  const authToken = req.headers["authorization"];

  // En un escenario real, compararía este token con una base de datos o algún otro sistema de autenticación.
  if (authToken === "Bearer miTokenSecreto123") {
    next(); // Si la autenticación es correcta, permitimos que la solicitud continúe
  } else {
    res.status(401).send("Acceso no autorizado");
  }
});


//Ruta raiz
app.get("/", (req, res) => {
  res.send("Bienvenido al administrador de tareas");
});


//Ruta para pedir todos las tareas
app.get("/Tarea", async (req, res) => {
  try {
    const tarea = await Tarea.find();
    res.json(tarea);
  } catch (error) {
    res.status(500).send("Error al obtener las tareas");
  }
});

// Crear una nueva Tarea
app.post("/Tarea", async (req, res) => {
  const tarea = new Tarea({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    aprobacion: req.body.aprobacion
  });

  try {
    await tarea.save();
    res.json(tarea);
  } catch (error) {
    res.status(500).send("Error al guardar tarea");
  }
});


// Ruta para obtener un tarea específica por su ID
app.get("/Tarea/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (tarea) {
      res.json(tarea);
    } else {
      res.status(404).send("Tarea no encontrada");
    }
  } catch (error) {
    res.status(500).send("Error al buscar tarea");
  }
});


// Ruta para actualizar un libro específico por su ID
app.put("/Tarea/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(
      req.params.id,
      {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        aprobacion: req.body.aprobacion,
      },
      { new: true } // Esta opción hará que se devuelva el documento actualizado
    );

    if (tarea) {
      res.json(tarea);
    } else {
      res.status(404).send("Tarea no encontrada");
    }
  } catch (error) {
    res.status(500).send("Error al actualizar la tarea");
  }
});


// Ruta para eliminar una tarea específico por su ID
app.delete("/Tarea/:id", async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndRemove(req.params.id);
    if (tarea) {
      res.status(204).send();
    } else {
      res.status(404).send("Libro no encontrado");
    }
  } catch (error) {
    res.status(500).send("Error al eliminar el libro");
  }
});


module.exports = app;
