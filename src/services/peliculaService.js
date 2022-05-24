import sql from 'mssql'
import config from '../../db.js'
import 'dotenv/config'

const peliculaTabla = process.env.DB_TABLA_PELICULA;
const personajeTabla = process.env.DB_TABLA_PERSONAJE;
const peliculaXpersonajeTabla = process.env.DB_TABLA_PELICULAPERSONAJE;

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

    getMovies = async (titulo, order) => {
        console.log('This is a function on the service');
        let response = 0;
        const pool = await sql.connect(config);
        if(titulo && order){
            response = await pool.request()
            .input('Titulo',sql.VarChar,titulo)
            .query(`SELECT * from ${peliculaTabla} WHERE Titulo LIKE %@Titulo% ORDER by Peliculas.Fecha ${order}`);
        }else if(titulo){
             	response = await pool.request()
            	.input('Titulo',sql.VarChar,titulo)
            	.query(`SELECT * from ${peliculaTabla} WHERE Titulo=@Titulo`);
        }else if(order){
                response = await pool.request()
            	.query((`SELECT * from ${peliculaTabla} ORDER BY Peliculas.Fecha ${order}`))
        }else{
            response = await pool.request().query(`SELECT * from ${peliculaTabla}`);
        }
        console.log(response)
        return response.recordset;
    }


    getMovieById = async (id) => {
        console.log('This is a function on the service');

        const pool = await sql.connect(config);
        const response = await pool.request()
            .input('Id',sql.Int, id)
            .query(`SELECT p.* from ${peliculaXpersonajeTabla} pp, ${personajeTabla} p where pp.Id_pelicula=@Id and pp.Id_personaje=p.Id`);
        const pelicula = await pool.request()
            .input('Id',sql.Int, id)
            .query(`SELECT * from ${peliculaTabla} WHERE Id=@Id`);

            pelicula.recordset[0].characters=response.recordset;

        console.log(response)

        return pelicula.recordset[0];
    }
}

