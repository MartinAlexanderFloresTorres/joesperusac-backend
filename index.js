import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import cors from 'cors'
import dotenv from 'dotenv'
import db from './src/config/db.js'
import categoriaRouters from './src/routers/categoriaRouters.js'
import productoRouters from './src/routers/productoRouters.js'
import brochureRouters from './src/routers/brochureRouters.js'
import usuarioRouters from './src/routers/usuarioRouters.js'

const app = express()

//Config
app.use(express.json())
dotenv.config()
app.use(cors({ origin: process.env.FRONTEND_URL }))

// DB
db()

// Puerto
const PORT = process.env.PORT || 4000

// Configurar cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true
})

// Rutas
app.use('/api/categorias', categoriaRouters)
app.use('/api/productos', productoRouters)
app.use('/api/brochures', brochureRouters)
app.use('/api/usuarios', usuarioRouters)

// listen
app.listen(PORT, () => {
  console.log(`RUN ${PORT}`)
})
