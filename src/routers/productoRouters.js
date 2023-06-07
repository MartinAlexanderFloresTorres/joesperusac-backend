import { Router } from 'express'
import fileUpload from 'express-fileupload'
import {
  actualizarProducto,
  buscarProductos,
  eliminarProductoById,
  nuevoProducto,
  obtenerProductoById,
  obtenerProductos,
  productoRelacionados
} from '../controllers/productoController.js'
import checkAuth from '../middlewares/checkAuth.js'

const productoRouters = Router()

productoRouters.post('/', checkAuth, fileUpload({ useTempFiles: false }), nuevoProducto)
productoRouters.put(
  '/:productoId',
  checkAuth,
  fileUpload({ useTempFiles: false }),
  actualizarProducto
)
productoRouters.delete('/:productoId', checkAuth, eliminarProductoById)
productoRouters.get('/:productoId', obtenerProductoById)
productoRouters.get('/', obtenerProductos)
productoRouters.get('/search/querys', buscarProductos)
productoRouters.get('/productos/relacionados', productoRelacionados)

export default productoRouters
