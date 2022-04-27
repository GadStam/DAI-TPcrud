import sql from 'mssql'
import config from '../../db.js'
import 'dotenv/config'

const personajeTabla = process.env.DB_TABLA_PERSONAJE;

export class PersonajeService {

    getPersonaje = async () => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request().query(`SELECT * from ${personajeTabla}`);
        console.log(response)

        return response.recordset;
    }

    createPersonaje = async (personaje) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Nombre',sql.VarChar, personaje?.Nombre ?? '')
            .input('Imagen',sql.VarChar, personaje?.Imagen ?? '')
            .input('Edad',sql.Int, personaje?.Edad ?? 0)
            .input('Peso',sql.Float, personaje?.Peso ?? 0)
            .input('Historia',sql.VarChar, personaje?.Historia ?? '')
            .input('Nacimiento',sql.VarChar, personaje?.Nacimiento ?? '')
            .query(`INSERT INTO ${personajeTabla}(Nombre, Imagen, Edad, Peso, Historia, Nacimiento) VALUES (@Nombre, @Imagen, @Edad, @Peso, @Historia, @Nacimiento)`);
        console.log(response)

        return response.recordset;
    }

    updatePersonajeById = async (id, personaje) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('id',sql.Int, id)
            .input('Nombre',sql.VarChar, personaje?.Nombre ?? '')
            .input('Imagen',sql.VarChar, personaje?.Imagen ?? '')
            .input('Edad',sql.Int, personaje?.Edad ?? 0)
            .input('Peso',sql.Float, personaje?.Peso ?? 0)
            .input('Historia',sql.VarChar, personaje?.Historia ?? '')
            .input('Nacimiento',sql.VarChar, personaje?.Nacimiento ?? '')
            .query(`UPDATE Personajes SET Nombre = @Nombre, Imagen = @Imagen, Edad = @Edad, Peso = @Peso, Historia = @Historia, Nacimiento = @Nacimiento WHERE Id = @Id`);
        console.log(response)

        return response.recordset;
    }

    deletePersonajeById = async (id) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Id',sql.Int, id)
            .query(`DELETE FROM ${personajeTabla} WHERE Id = @Id`);
        console.log(response)

        return response.recordset;
    }



}