import { saveFile, fetchFiles, modifyFile, deleteFile } from '../repository/filesRepository.js';
import { addUser, login } from '../repository/userRepository.js';
import jwt from '../jwtUtils/index.js';

const decodeToken = async (input) => {
    try {
        return await jwt.decodeJWT(input);
    } catch (e) {
        console.log(e);
        return null;
    }
};

const verifyUser = async (request) => {
    const token = await decodeToken(request.headers.authorization);
    return token.data;
}

export async function registerPerson(request, response) {
    try {
        const userId = await addUser(request.body);
        response.status(201).send(`Registration successfull: ${userId}`);
    }
    catch (err) {
        response.status(500).send(`Something went wrong`);
    }
}

export async function addfile(request, response) {
    try {
        const user = await verifyUser(request);
        const fileId = await saveFile(request.body, user);
        response.status(201).send(`file saved sucessfully: ${fileId}`)
    }
    catch (e) {
        response.status(500).send(`Something went wrong`);
    }
}

export async function userLogin(request, response) {
    try {
        const user = await login(request.body);
        const userDetails = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.lastname,
            admin: user.admin
        };
        console.log(userDetails);
        const token = jwt.signJWT(
            userDetails
        );
        response.status(200).send({ jwtToken: token, user: userDetails })
    }
    catch (e) {
        response.status(401).send({ message: "email or password was incorrect" })

    }
}

export async function getFiles(request, response) {
    try {
        const user = await verifyUser(request);
        const files = await fetchFiles(user);
        response.status(200).json(files)
    }
    catch (e) {
        console.log(e);
        response.status(200).json([])
    }
}

export async function updateFile(request, response) {
    try {
        const user = await verifyUser(request);
        const { id } = request.params;
        const { fileDescription } = request.body;
        await modifyFile({ id, fileDescription }, user);
        response.status(200).send({ message: 'file updated' })
    }
    catch (e) {
        console.log(e);
        response.status(500).json({ message: 'something went wrong' })
    }
}

export async function removefile(request, response) {
    try {
        const user = await verifyUser(request);
        await deleteFile(request.params, user);
        response.status(200).send({ message: 'file deleted' })
    }
    catch (e) {
        console.log(e);
        response.status(500).json({ message: 'something went wrong' })
    }

}