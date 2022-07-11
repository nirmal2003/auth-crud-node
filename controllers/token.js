const JWT = require('jsonwebtoken')

const CreateToken = async (data) => {
    const token = await JWT.sign({ id: data }, "J%20W%20T%206014646d8we4f6er8f24fnoifnoifnf,ejfoeriucrmeiurlerfuerifuerf8457&*#!@#$%^&*()qwertyuiopQWERTYUIOPasdfghjklASDFGHJKLzxcvbnmZXCVBNM")
    return token
}

module.exports = CreateToken