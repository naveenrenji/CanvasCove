import jwt from "jsonwebtoken";

class JwtService {
  static encrypt(data) {
    try {
      return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "24h" });
    } catch (e) {
      console.log(e);
      return;
    }
  }

  static async decrypt(token) {
    return (await jwt.verify(token, process.env.JWT_SECRET)) || {};
  }
}

export default JwtService;
