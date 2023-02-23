import jwt, { JwtPayload } from "jsonwebtoken";
const secret = process.env.TOKEN_KEY as string;

export const refreshJWT = (token: string): string => {
  try {
    // if error do refresh
    jwt.verify(token, secret) as { [key: string]: any };
    return token;
    // Handle expired token error here
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      const decoded = jwt.decode(token) as JwtPayload;

      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        // Check if token has expired
        // Generate a new token with a new expiration time
        const newToken = jwt.sign(
          { user_id: decoded.user_id, email: decoded.email },
          secret,
          { expiresIn: "2h" }
        ); // Set new expiration time as needed

        return newToken;
      }
    } else {
      // Handle other errors here
      console.log("Error verifying token", err);
    }
    return token; // Or throw the error if appropriate for your use case
  }
};
