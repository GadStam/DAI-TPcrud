import { Router } from 'express';
import { PersonajeService } from '../services/personajeService.js';
import { Authenticate } from '../common/jwt.strategy.js';


const router = Router();
const personajeService = new PersonajeService();

router.get('/', Authenticate, async (req, res) => {
  console.log(`This is a get operation`);
  let nombre = req.query.nombre;
  let edad = req.query.edad;

  console.log(nombre);
  
  const personaje = await personajeService.getPersonaje(nombre,edad);

  return res.status(200).json(personaje);
});


router.post('', Authenticate, async (req, res) => {
  console.log(`This is a post operation`);

  const personaje = await personajeService.createPersonaje(req.body);

  return res.status(201).json(personaje);
});

router.put('/:id', Authenticate, async (req, res) => {
  console.log(`Request URL Param: ${req.params.id}`);
  console.log(`This is a put operation`);

  const personaje = await personajeService.updatePersonajeById(req.params.id, req.body);
  

  return res.status(200).json(personaje);
});

router.delete('/:id', Authenticate, async (req, res) => {
  console.log(`Request URL Param: ${req.params.id}`);
  console.log(`This is a delete operation`);

  const personaje = await personajeService.deletePersonajeById(req.params.id);

  return res.status(200).json(personaje);
});


router.get('/characters', Authenticate, async (req, res) => {
  console.log(`This is a get operation`);

  const personaje = await personajeService.getCharacters();

  return res.status(200).json(personaje);
});

router.get('/:id', async (req, res) => {
  console.log(`Request URL Param: ${req.params.id}`);
  console.log(`This is a get operation`);

  const personaje = await personajeService.getCharacterById(req.params.id);

  return res.status(200).json(personaje);
});

export default router;
