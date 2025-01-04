import userModel from '../database/models/UserModel.js'

export const createUser = async ({
    name, email, password
}) => {
    if (!name || !email || !password) {
        throw new Error('Email and Password are required')
    }

    const hashedpassword = await userModel.hashPassword(password)

    const user = await userModel.create({
        name,
        email,
        password: hashedpassword
    })

    return user;
}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId },
        email: { $ne: "jarvisai@gmail.com" }
    });
    return users;
}