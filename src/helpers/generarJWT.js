import jwt from 'jsonwebtoken'

const generarJWT = ({ data }) => {
  return jwt.sign({ data }, process.env.JWT_SECRET, {
    expiresIn: '14d'
  })
}

export default generarJWT
