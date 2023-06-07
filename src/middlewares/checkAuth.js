import jwt from 'jsonwebtoken'

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers
  let token = null
  // si hay un token en el header
  if (authorization && authorization?.startsWith('Bearer')) {
    try {
      token = authorization.split(' ')[1]
      const decored = jwt.verify(token, process.env.JWT_SECRET)

      req.user = decored

      return next()
    } catch (e) {
      const error = new Error('Token no válido')
      return res.status(403).json({ message: error.message })
    }
  }

  if (!token) {
    const error = new Error('Token requerido')
    return res.status(403).json({ message: error.message })
  }

  next()
}

export default checkAuth
