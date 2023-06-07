import { Router } from 'express'
import { comprobarAdmin, loginAdmin } from '../controllers/usuarioController.js'
import checkAuth from '../middlewares/checkAuth.js'

const usuarioRouters = Router()

usuarioRouters.post('/login/admin', loginAdmin)
usuarioRouters.get('/comprobar/admin', checkAuth, comprobarAdmin)

export default usuarioRouters
