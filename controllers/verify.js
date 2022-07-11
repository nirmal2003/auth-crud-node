const JWT = require('jsonwebtoken')

const verify = async (req, res, next) => {
    const token = req.cookies.token
    if(!token) return res.send({ success: false, message: 'Access denied!' })
    else {
        try {
            const verify = await JWT.verify(token, "J%20W%20T%206014646d8we4f6er8f24fnoifnoifnf,ejfoeriucrmeiurlerfuerifuerf8457&*#!@#$%^&*()qwertyuiopQWERTYUIOPasdfghjklASDFGHJKLzxcvbnmZXCVBNM")
            req.user = verify
            next()
        } catch (err) {
            return res.send({ success: false, message: 'Invalid token' })
        }
    }
}

module.exports = verify