import { Router } from 'express'
import fileUpload from 'express-fileupload'
import {
  actualizarBrochure,
  crearBrochure,
  eliminarBrochure,
  obtenerBrochures
} from '../controllers/brochureController.js'
import checkAuth from '../middlewares/checkAuth.js'

const brochureRouters = Router()

brochureRouters.post('/', checkAuth, fileUpload({ useTempFiles: false }), crearBrochure)
brochureRouters.put(
  '/:brochureId',
  checkAuth,
  fileUpload({ useTempFiles: false }),
  actualizarBrochure
)
brochureRouters.delete('/:brochureId', checkAuth, eliminarBrochure)
brochureRouters.get('/', obtenerBrochures)

export default brochureRouters
