import * as yup from 'yup'

// const MAX_FILE_SIZE = 2048 * 1024;
// const SUPPORTED_FILE_FORMATS = [
//     "image/jpg",
//     "image/jpeg",
//     "image/png",
//     "application/pdf"
// ];

const passwordRule = yup.string().trim()
    .min(6, "Should have more than one character")
const stringRule = yup.string().trim().min(5).required()
const roleRule = yup.string().trim().required()

const slugRule = yup.string().trim().lowercase(true).min(3).required()
const titleRule = yup.string().trim().min(3).required()
const title = yup.string().trim().min(10).required()
const contentRule = yup.string().trim().min(10).required()
const catRule = yup.array().required()

export const validator = async (schema, value) => {
    return yup.object().shape({
        ...schema
    }).validate(value)
}

export const login = {
    username: stringRule,
    password: passwordRule
}

export const category = {
    title: titleRule,
    slug: slugRule
}

export const post = {
    title: title,
    content: contentRule,
    category: catRule,
}

export const register = {
    username: stringRule,
    fullname: stringRule,
    phone: stringRule,
    email: stringRule.email("Check the email again"),
    password: passwordRule,
    user_role: roleRule
    // password1: yup.string().trim().required().test('passwords-match', 'Passwords must match', function(value){
    //     return this.parent.password === value
    // }),
}
