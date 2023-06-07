import jwt from 'jsonwebtoken'

const comprobarJWT = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export default comprobarJWT
