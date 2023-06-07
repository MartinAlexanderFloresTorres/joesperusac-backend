import mongoose from 'mongoose'

const brochureSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    archivo: {
      type: Object,
      default: {},
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Brochure = mongoose.model('brochure', brochureSchema)

export default Brochure
