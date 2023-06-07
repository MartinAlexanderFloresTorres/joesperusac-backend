import Producto from '../models/Producto.js'
import Categoria from '../models/categoria.js'
import validarImagenes from '../helpers/validarImagenes.js'
import writeImagen from '../helpers/writeImagen.js'
import deleteFile from '../cloudinary/deleteFile.js'
import isValidId from '../helpers/isValidId.js'

// NUEVO PRODUCTO
export const nuevoProducto = async (req, res) => {
  try {
    const { titulo, descripcion, caracteristicas, categoria } = req.body

    // Validar campos
    if (!titulo || !descripcion || !categoria || !caracteristicas) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    // Validar que la categoria exista
    const categoriaExiste = await Categoria.findById(categoria)

    if (!categoriaExiste) {
      return res.status(400).json({ message: 'La categoria no existe' })
    }

    // Crear nuevo producto
    const producto = new Producto({
      titulo,
      descripcion,
      categoria,
      caracteristicas
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
      producto.imagen = await writeImagen(file, 'shop-app/productos')
    }

    // Guardar producto
    await producto.save()

    // Respuesta
    res.status(200).json(producto)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// ACTUALIZAR PRODUCTO
export const actualizarProducto = async (req, res) => {
  try {
    const { productoId } = req.params
    const { titulo, descripcion, caracteristicas, categoria, editImage } = req.body

    // Validar campos
    if (!titulo || !descripcion || !categoria || !caracteristicas) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    // Validar que el producto exista
    const producto = await Producto.findById(productoId)

    if (!producto) {
      return res.status(400).json({ message: 'El producto no existe' })
    }

    // Validar que la categoria exista
    const categoriaExiste = await Categoria.findById(categoria)

    if (!categoriaExiste) {
      return res.status(400).json({ message: 'La categoria no existe' })
    }

    // Validar si se envio una imagen
    if (req.files && editImage) {
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

      // Eliminar imagen anterior
      await deleteFile({ public_id: producto.imagen.public_id, folder: 'shop-app/productos' })

      // Guardar imagen
      producto.imagen = await writeImagen(file, 'shop-app/productos')
    }

    // Actualizar producto
    producto.titulo = titulo
    producto.descripcion = descripcion
    producto.categoria = categoria
    producto.caracteristicas = caracteristicas

    // Guardar producto
    await producto.save()

    // Respuesta
    res.status(200).json({ message: 'Producto actualizado correctamente' })
  } catch (error) {
    console.log(error)
    const { message } = error
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

// OBTENER PRODUCTOS
export const obtenerProductos = async (req, res) => {
  try {
    // Obtener productos
    const productos = await Producto.find()

    // Respuesta
    res.status(200).json(productos)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// OBTENER PRODUCTO BY ID
export const obtenerProductoById = async (req, res) => {
  try {
    const { productoId } = req.params

    if (!isValidId(productoId)) {
      return res.status(400).json({ message: 'El id no es valido' })
    }

    // Validar que el producto exista
    const producto = await Producto.findById(productoId).populate('categoria')

    if (!producto) {
      return res.status(400).json({ message: 'El producto no existe' })
    }

    // Respuesta
    res.status(200).json(producto)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// ELIMINAR PRODUCTO BY ID
export const eliminarProductoById = async (req, res) => {
  try {
    const { productoId } = req.params

    // Validar que el producto exista
    const producto = await Producto.findById(productoId)

    if (!producto) {
      return res.status(400).json({ message: 'El producto no existe' })
    }

    // Eliminar imagen
    await deleteFile({ public_id: producto.imagen.public_id, folder: 'shop-app/productos' })

    // Eliminar producto
    await Producto.deleteOne()

    // Respuesta
    res.status(200).json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

// BUSCAR PRODUCTOS
export const buscarProductos = async (req, res) => {
  try {
    const { query } = req.query

    const regex = new RegExp(query, 'i')

    // Buscar productos
    const productos = await Producto.find({
      $or: [{ titulo: regex }, { descripcion: regex }, { caracteristicas: regex }]
    })

    // Respuesta
    res.status(200).json(productos)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}

export const productoRelacionados = async (req, res) => {
  try {
    const { categoriaId, productoId, limit } = req.query

    // Buscar productos
    const productos = await Producto.find({
      categoria: categoriaId,
      _id: { $ne: productoId }
    }).limit(Number(limit || 12) || 12)

    // Respuesta
    res.status(200).json(productos)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error en el servidor' })
  }
}
