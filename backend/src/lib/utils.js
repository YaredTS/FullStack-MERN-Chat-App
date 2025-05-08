import jwt from "jsonwebtoken"
// to generate token you are going to need environmental variable
export const generateToken = (userId, res) => {
    //jwt.sign(payload, secret, options)
    // process.env.JWT_SECRET → Used to encrypt and verify the token.
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    })
      

     // Store the token in an HTTP-only cookie
     //res.cookie(name, value, options)
 res.cookie("jwt", token, {
    httpOnly: true,  // Prevents JavaScript access (XSS protection) (croos-site scripting attacks)
    secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
    // use secure in the production phase we have set the NODE_ENV to development in the mean time
    sameSite: "strict",  // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});
return token;
}

