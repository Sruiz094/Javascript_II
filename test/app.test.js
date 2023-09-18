// Importamos el módulo 'supertest' para realizar pruebas de endpoints.
const request = require("supertest");

// Importamos nuestra aplicación. Asegúrate de exportar 'app' en tu archivo principal.
const app = require("../src/app"); // Importa la instancia del servidor
const mongoose = require("mongoose"); // Asegúrate de requerir mongoose

// Usamos 'describe' para agrupar pruebas relacionadas. En este caso, estamos agrupando pruebas relacionadas con los endpoints de la tarea.
describe("Endpoints de Tareas", () => {
  // Una prueba individual usando 'it' o 'test'. Esta prueba verifica si podemos obtener una lista de tarea.
  test("Debería obtener una lista de tarea", async () => {
    // Realizamos una solicitud GET a '/libros' usando nuestra aplicación.
    const res = await request(app)
      .get("/Tarea")
      .set("Authorization", "Bearer miTokenSecreto123");

    // Esperamos que el código de estado de la respuesta sea 200 (OK).
    expect(res.statusCode).toEqual(200);

    // Esperamos que el cuerpo de la respuesta sea un array.
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Otra prueba para verificar la creación de un tarea.
  test("Debería crear una nueva tarea", async () => {
    // Realizamos una solicitud POST a '/tarea' con un cuerpo de datos.
    const res = await request(app)
      .post("/Tarea")
      .send({

        nombre: "Tarea prueba",
        descripcion: "Descripcion de la tarea prueba",
        aprobacion: "1",

      })
      .set("Authorization", "Bearer miTokenSecreto123");

    // Esperamos que el código de estado de la respuesta sea 200 (OK).
    expect(res.statusCode).toEqual(200);

    // Esperamos que el nombre de la tarea en la respuesta sea 'Tarea prueba'.
    expect(res.body.nombre).toEqual("Tarea prueba");
  });

  // Puedes seguir este patrón para agregar más pruebas, por ejemplo, para actualizar una tarea (PUT) o eliminarlo (DELETE).

  /*La función afterAll es una función proporcionada por Jest que te permite ejecutar código 
  después de que se hayan ejecutado todas las pruebas en un archivo de prueba o un 
  bloque describe específico.*/

  afterAll(async () => {
    // Cierra la conexión a mongoose
    await mongoose.connection.close();
  });
});
