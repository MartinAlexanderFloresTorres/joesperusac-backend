import mongoose from 'mongoose'

const productoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      unique: true,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    caracteristicas: {
      type: String,
      required: true
    },
    imagen: {
      type: Object,
      default: {},
      required: true
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'categoria',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Producto = mongoose.model('producto', productoSchema)

export default Producto
