import deleteFile from '../cloudinary/deleteFile.js'
import writePdf from '../helpers/writePdf.js'
import Brochure from '../models/Brochure.js'

export const crearBrochure = async (req, res) => {
  try {
    const { nombre } = req.body

    if (!req.files) {
      return res.status(400).json({ message: 'No se envio ningun archivo' })
    }

    // Validar si se envio una imagen
    const { file } = req.files
    const { mimetype, size } = file

    // Validar que sea un pdf
    if (mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'El archivo no es un pdf' })
    }

    // Validar tamaño de la imagen supera los 100mb (100000000 bytes)
    if (size > 100000000) {
      return res.status(400).json({ message: 'El archivo supera los 100mb' })
    }

    // Guardar file
    const brochure = new Brochure({
      nombre,
      archivo: await writePdf(file, 'shop-app/brochures')
    })

    // Guardar brochure
    await brochure.save()

    // Respuesta
    res.status(200).json({ message: 'Brochure creado correctamente', brochure })
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error al crear brochure' })
  }
}

export const obtenerBrochures = async (req, res) => {
  try {
    const brochures = await Brochure.find()

    res.status(200).json(brochures)
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error al obtener brochure' })
  }
}

export const actualizarBrochure = async (req, res) => {
  try {
    const { nombre } = req.body
    const { brochureId } = req.params

    const existeBrochure = await Brochure.findOne({ nombre })

    // Existe el brochure
    if (existeBrochure && existeBrochure._id.toString() !== brochureId) {
      return res.status(400).json({ message: 'El brochure ya existe' })
    }

    if (!req.files) {
      return res.status(400).json({ message: 'No se envio ningun archivo' })
    }

    // Validar si se envio una imagen
    const { file } = req.files
    const { mimetype, size } = file

    // Validar que sea un pdf
    if (mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'El archivo no es un pdf' })
    }

    // Validar tamaño de la imagen supera los 100mb (100000000 bytes)
    if (size > 100000000) {
      return res.status(400).json({ message: 'El archivo supera los 100mb' })
    }

    // Guardar file
    const brochure = await Brochure.findById(brochureId)

    // Eliminar archivo anterior
    await deleteFile({ public_id: brochure.archivo.public_id, folder: 'shop-app/brochures' })

    brochure.archivo = await writePdf(file, 'shop-app/brochures')
    brochure.nombre = nombre

    // Guardar brochure
    await brochure.save()

    // Respuesta
    res.status(200).json({ message: 'Brochure actualizado correctamente', brochure })
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error al actualizar brochure' })
  }
}

export const eliminarBrochure = async (req, res) => {
  try {
    const { brochureId } = req.params

    const brochure = await Brochure.findById(brochureId)

    // Existe el brochure
    if (!brochure) {
      return res.status(400).json({ message: 'El brochure no existe' })
    }

    // Eliminar archivo anterior
    await deleteFile({ public_id: brochure.archivo.public_id, folder: 'shop-app/brochures' })

    await brochure.deleteOne()

    res.status(200).json({ message: 'Brochure eliminado correctamente' })
  } catch (error) {
    const { message } = error
    console.log(error)
    res.status(500).json({ message: message || 'Error al eliminar brochure' })
  }
}
