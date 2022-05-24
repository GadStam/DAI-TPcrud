import sql from 'mssql'
import config from '../../db.js'
import 'dotenv/config'

const personajeTabla = process.env.DB_TABLA_PERSONAJE;
const peliculaTabla = process.env.DB_TABLA_PELICULA;
const peliculaXpersonajeTabla = process.env.DB_TABLA_PELICULAPERSONAJE;

export class PersonajeService {

    getPersonaje = async (nombre,edad,id_movie) => {
        console.log('This is a function on the service');
        let response;
        const pool = await sql.connect(config);
        let solicitud="";
        if(nombre && edad && id_movie){
            solicitud=`SELECT c.* from ${peliculaXpersonajeTabla} pp, ${personajeTabla} c WHERE c.Nombre=@Nombre and c.Edad=@Edad and pp.Id_pelicula=@Id`;
        }else if(edad && nombre){
            solicitud=`SELECT * from ${personajeTabla} WHERE Edad=@Edad and Nombre=@Nombre`;
        }else if(edad && id_movie){
            solicitud=`SELECT c.* from ${peliculaXpersonajeTabla} pp, ${personajeTabla} c WHERE c.Edad=@Edad and pp.Id_pelicula=@Id`;
        }else if(id_movie && nombre){
            solicitud=`SELECT c.* from ${peliculaXpersonajeTabla} pp, ${personajeTabla} c WHERE c.Nombre=@Nombre and pp.Id_pelicula=@Id`;
        }else if(nombre){
            solicitud=`SELECT * from ${personajeTabla} WHERE Nombre=@Nombre`;
        }else if(edad){
            solicitud=`SELECT * from ${personajeTabla} WHERE Edad=@Edad`;
        }else if(id_movie){
            solicitud=`SELECT c.* from ${peliculaXpersonajeTabla} pp, ${personajeTabla} c WHERE pp.Id_pelicula=@Id`;
        }else{
            solicitud=`SELECT Nombre, Imagen, Id from ${personajeTabla}`;
        }
        console.log(response)

        response=await pool.request().input('Edad',sql.Int,edad).input('Nombre',sql.VarChar,nombre).input('Id',sql.Int,id_movie).query(solicitud)

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
            .input('Id',sql.Int, id)
            .input('Nombre',sql.VarChar, personaje?.Nombre ?? '')
            .input('Imagen',sql.VarChar, personaje?.Imagen ?? '')
            .input('Edad',sql.Int, personaje?.Edad ?? 0)
            .input('Peso',sql.Float, personaje?.Peso ?? 0)
            .input('Historia',sql.VarChar, personaje?.Historia ?? '')
            .input('Nacimiento',sql.VarChar, personaje?.Nacimiento ?? '')
            .query(`UPDATE ${personajeTabla} SET Nombre = @Nombre, Imagen = @Imagen, Edad = @Edad, Peso = @Peso, Historia = @Historia, Nacimiento = @Nacimiento WHERE Id = @Id`);
        console.log(response)
        console.log(personaje.id)

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

    getCharacters = async () => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request().query(`SELECT Nombre, Imagen, Id from ${personajeTabla}`);
        console.log(response)

        return response.recordset;
    }

    getCharacterById = async (id) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Id',sql.Int, id)
            .query(`SELECT m.* from ${peliculaXpersonajeTabla} pp, ${peliculaTabla} m where pp.Id_personaje=@Id and pp.Id_pelicula=m.Id`);
        const personaje = await pool.request()
            .input('Id',sql.Int, id)
            .query(`SELECT * from ${personajeTabla} WHERE Id=@Id`);

            personaje.recordset[0].movies=response.recordset;

        console.log(response)

        return personaje.recordset[0];
    }
}