import jsonwebtoken from 'jsonwebtoken';

const privateKey = 'prviateKeyToSignJWTtoken';

const signJWT = (data) => jsonwebtoken.sign({
    data
}, privateKey, { expiresIn: 60 * 60 });

const decodeJWT = async (token) =>
    jsonwebtoken.verify(token, privateKey, {});

const jwt = {
    signJWT,
    decodeJWT
};

export default jwt;
