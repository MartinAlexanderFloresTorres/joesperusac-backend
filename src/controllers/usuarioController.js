import generarJWT from '../helpers/generarJWT.js'

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({
        message: 'Email o contraseña incorrectos'
      })
    }

    res.json({
      message: 'Bienvenido',
      token: generarJWT({ data: { email } })
    })
  } catch (error) {
    console.log(error)
    const { message } = error
    res.status(500).json({
      message
    })
  }
}

export const comprobarAdmin = async (req, res) => {
  try {
    const { data } = req.user

    if (data.email !== process.env.ADMIN_EMAIL) {
      return res.status(400).json({
        message: 'No tienes permisos para acceder a esta ruta'
      })
    }

    res.json({
      message: 'Bienvenido',
      token: generarJWT({ data: { email: process.env.ADMIN_EMAIL } })
    })
  } catch (error) {
    console.log(error)
    const { message } = error
    res.status(500).json({
      message
    })
  }
}
