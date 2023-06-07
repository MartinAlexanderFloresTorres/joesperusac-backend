import mongoose from 'mongoose'

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      unique: true,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    imagen: {
      type: Object,
      default: {},
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Categoria = mongoose.model('categoria', categoriaSchema)

export default Categoria
