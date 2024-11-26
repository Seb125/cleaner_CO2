module.exports = (req, res, next) => {
    const token = process.env.token || "7389473IOHD()DDSAHlk#";
    console.log(req.headers.apitoken, token)

    if (req.headers.apitoken !== token) {
        const error = new Error("Invalid Token");
        error.status = 401; 
        return next(error);
    }
  
    next();
  }