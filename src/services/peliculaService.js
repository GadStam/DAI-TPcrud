import sql from 'mssql'
import config from '../../db.js'
import 'dotenv/config'

const peliculaTabla = process.env.DB_TABLA_PELICULA;

export class PeliculaService {

    createPelicula = async (pelicula) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Imagen',sql.VarChar, pelicula?.Imagen ?? '')
            .input('Titulo',sql.VarChar, pelicula?.Titulo ?? '')
            .input('Fecha',sql.VarChar, pelicula?.Fecha ?? '')
            .input('Calificacion',sql.Int, pelicula?.Calificacion ?? 0)
            .query(`INSERT INTO ${peliculaTabla}(Imagen, Titulo, Fecha, Calificacion) VALUES (@Imagen, @Titulo, @Fecha, @Calificacion)`);
        console.log(response)

        return response.recordset;
    }

    updatePeliculaById = async (id, pelicula) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Id',sql.Int, id)
            .input('Imagen',sql.VarChar, pelicula?.Imagen ?? '')
            .input('Titulo',sql.VarChar, pelicula?.Titulo ?? '')
            .input('Fecha',sql.VarChar, pelicula?.Fecha ?? '')
            .input('Calificacion',sql.Int, pelicula?.Calificacion ?? 0)
            .query(`UPDATE ${peliculaTabla} SET Imagen = @Imagen, Titulo = @Titulo, Fecha = @Fecha, Calificacion = @Calificacion WHERE Id = @Id`);
        console.log(response)
        console.log(pelicula.id)

        return response.recordset;
    }

    deletePeliculaById = async (id) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Id',sql.Int, id)
            .query(`DELETE FROM ${peliculaTabla} WHERE Id = @Id`);
        console.log(response)

        return response.recordset;
    }

    getMovies = async () => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request().query(`SELECT Titulo, Imagen, Id, Fecha from ${peliculaTabla}`);
        console.log(response)

        return response.recordset;
    }
}

