import jwt from "jsonwebtoken";
const secretJWT = process.env.JWT_SECRET;

export function generate(data) {
  return jwt.sign(data, secretJWT);
}

export function decode(token) {
  try {
    const decoded = jwt.verify(token, secretJWT);
    return decoded;
  } catch (error) {
    console.error("token incorrecto");
    return null;
  }
}
