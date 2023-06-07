import Producto from '../models/Producto.js'
import Categoria from '../models/categoria.js'
import validarImagenes from '../helpers/validarImagenes.js'
import writeImagen from '../helpers/writeImagen.js'
import isValidId from '../helpers/isValidId.js'
import deleteFile from '../cloudinary/deleteFile.js'

// NUEVA CATEGORIA
export const nuevaCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body

    // Validar campos
    if (!nombre || !descripcion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    // Validar que no exista una categoria con el mismo nombre
    const categoriaExistente = await Categoria.findOne({ nombre })
    if (categoriaExistente) {
      return res.status(400).json({ message: 'Ya existe una categoria con ese nombre' })
    }

    // Crear nueva categoria
    const categoria = new Categoria({
      nombre,
      descripcion
    })

    // Validar si se envio una imagen
    if (req.files) {
      const { file } = req.files
      const { mimetype, size } = file

      // Validar que sea una imagen
      if (!validarImagenes({ tipo: mimetype })) {
        return res.status(400).json({ message: 'El archivo no es una imagen' })
      }

      // Validar tamaño de la imagen
      if (size > 2000000) {
        return res.status(400).json({ message: 'El archivo es demasiado grande' })
      }

      // Guardar imagen
      categoria.imagen = await writeImagen(file, 'shop-app/categorias')
    }

    // Guardar categoria
    await categoria.save()

    // Respuesta
    res.status(200).json(categoria)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

// ACTUALIZAR CATEGORIA
export const actualizarCategoria = async (req, res) => {
  try {
    const { categoriaId } = req.params
    const { nombre, descripcion } = req.body

    // Validar campos
    if (!nombre || !descripcion) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    // Validar que la categoria exista
    const categoria = await Categoria.findById(categoriaId)
    if (!categoria) {
      return res.status(400).json({ message: 'La categoria no existe' })
    }

    // Validar que no exista una categoria con el mismo nombre
    const categoriaExistente = await Categoria.findOne({ nombre })
    if (categoriaExistente && categoriaExistente._id.toString() !== categoriaId) {
      return res.status(400).json({ message: 'Ya existe una categoria con ese nombre' })
    }

    // Actualizar categoria
    categoria.nombre = nombre
    categoria.descripcion = descripcion

    // Validar si se envio una imagen
    if (req.files) {
      const { file } = req.files
      const { mimetype, size } = file

      // Validar que sea una imagen
      if (!validarImagenes({ tipo: mimetype })) {
        return res.status(400).json({ message: 'El archivo no es una imagen' })
      }

      // Validar tamaño de la imagen
      if (size > 2000000) {
        return res.status(400).json({ message: 'El archivo es demasiado grande' })
      }

      // Guardar imagen
      categoria.imagen = await writeImagen(file, 'shop-app/categorias')
    }

    // Guardar categoria
    await categoria.save()

    // Respuesta
    res.status(200).json(categoria)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

// OBTENER CATEGORIAS
export const obtenerCategorias = async (req, res) => {
  try {
    // Obtener categorias
    const categorias = await Categoria.find()

    res.status(200).json(categorias)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

// OBTENER CATEGORIA POR ID
export const obtenerCategoriaById = async (req, res) => {
  try {
    const { categoriaId } = req.params

    // Validar que exista la categoria
    const categoria = await Categoria.findById(categoriaId)
    if (!categoria) {
      return res.status(400).json({ message: 'No existe la categoria' })
    }

    // Respuesta
    res.status(200).json(categoria)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

// OBTENER PRODUCTOS DE LAS CATEGORIAS BY ID
export const obtenerProductosByCategoriaId = async (req, res) => {
  try {
    const { categoriaId } = req.params

    if (!isValidId(categoriaId)) {
      return res.status(400).json({ message: 'El id no es valido' })
    }

    // Validar que exista la categoria
    const categoria = await Categoria.findById(categoriaId)
    if (!categoria) {
      return res.status(400).json({ message: 'No existe la categoria' })
    }

    // Obtener productos de la categoria
    const productos = await Producto.find({ categoria: categoriaId })

    // Respuesta
    res.status(200).json({ categoria, productos })
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

// ELIMINAR CATEGORIA BY ID
export const eliminarCategoriaById = async (req, res) => {
  try {
    const { categoriaId } = req.params

    // Validar que exista la categoria
    const categoria = await Categoria.findById(categoriaId)
    if (!categoria) {
      return res.status(400).json({ message: 'No existe la categoria' })
    }

    // Eliminar imagen de cloudinary
    if (categoria.imagen) {
      await deleteFile(categoria.imagen)
    }

    // Eliminar productos de la categoria
    const productos = await Producto.find({ categoria: categoriaId })
    for (const producto of productos) {
      await deleteFile({ public_id: producto.imagen.public_id, folder: 'shop-app/productos' })
      await producto.deleteOne()
    }

    // Eliminar categoria
    await categoria.deleteOne()

    // Respuesta
    res.status(200).json({ message: 'Categoria eliminada correctamente' })
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

export const obtenerCategoriasProductos = async (req, res) => {
  try {
    // Obtener categorias
    const categorias = await Categoria.find()

    // Obtener productos de cada categoria
    const categoriasProductos = []

    // Obtener productos de cada categoria
    for (const categoria of categorias) {
      // Obtener productos de la categoria
      const productos = await Producto.find({ categoria: categoria._id })
      // Guardar categoria y productos
      categoriasProductos.push({ categoria, productos })
    }

    // Respuesta
    res.status(200).json(categoriasProductos)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}
