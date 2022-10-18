import jsonwebtoken from 'jsonwebtoken';

// TODO: get the keys from env
const privateKey = 'somefilename';
const publicKey = 'somepublicKey';

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
