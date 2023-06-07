import { Router } from 'express'
import fileUpload from 'express-fileupload'
import {
  actualizarCategoria,
  eliminarCategoriaById,
  nuevaCategoria,
  obtenerCategoriaById,
  obtenerCategorias,
  obtenerCategoriasProductos,
  obtenerProductosByCategoriaId
} from '../controllers/categoriaControllers.js'
import checkAuth from '../middlewares/checkAuth.js'

const categoriaRouters = Router()

categoriaRouters.post('/', checkAuth, fileUpload({ useTempFiles: false }), nuevaCategoria)
categoriaRouters.put(
  '/:categoriaId',
  checkAuth,
  fileUpload({ useTempFiles: false }),
  actualizarCategoria
)
categoriaRouters.get('/:categoriaId', obtenerCategoriaById)
categoriaRouters.delete('/:categoriaId', eliminarCategoriaById)
categoriaRouters.get('/productos/:categoriaId', obtenerProductosByCategoriaId)
categoriaRouters.get('/productos/categorias/find', obtenerCategoriasProductos)
categoriaRouters.get('/', obtenerCategorias)

export default categoriaRouters
