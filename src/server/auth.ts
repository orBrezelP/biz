
import { JwtPayload, VerifyErrors, sign, verify } from 'jsonwebtoken';

const SECRET_KEY = 'your-secret-key'; // use the same key as you used in sign

export function generateToken(userId: number) {
    // Generate JWT token
    return sign({ userId }, SECRET_KEY, {
        expiresIn: '1h', // Token expiration time
    });
}

export function  verifyToken(token: string, callback: (err: VerifyErrors | null
    , decoded?: string | JwtPayload) => void) {
    verify(token, SECRET_KEY, callback);
}