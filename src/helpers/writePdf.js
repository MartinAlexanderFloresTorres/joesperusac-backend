import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs'
import validarImagenes from './validarImagenes.js'
import shortid from 'shortid'
import uploadFile from '../cloudinary/uploadFile.js'

const writePdf = async (file, folder) => {
  // Obtener extencion
  const extencion = file.name.split('.').pop()

  // Validar que sea un pdf
  const { mimetype } = file
  if (mimetype !== 'application/pdf') {
    throw new Error('El archivo no es un pdf')
  }

  // Ruta de la carpeta que quieres crear si no existe
  const folderPath = './public/uploads'

  // Comprobar si la carpeta existe
  if (!existsSync(folderPath)) {
    // Crear la carpeta si no existe
    mkdirSync(folderPath)
  }

  // Generar nombre con la ruta
  const path = `${folderPath}/${shortid.generate()}.${extencion}`

  // Guardar file
  writeFileSync(path, file.data)

  // Subir imagen
  const data = await uploadFile({ path, folder })

  // Extraer datos
  const { public_id, secure_url } = data

  // Crear objeto
  const imagen = { public_id, secure_url }

  // Eliminar file
  unlinkSync(path)

  return imagen
}

export default writePdf
