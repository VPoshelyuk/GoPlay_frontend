export function setUser(newUser){
    return {type: "SET_USER", payload: {user: newUser}}
}

export function passEmailAndPass(newEmail, newPass){
    return {type: "PASS_EMAIL_AND_PASS", payload: {email: newEmail, password: newPass}}
}
