module.exports = (req, res, next) => {
    const token = process.env.token || "t0k3n";
    console.log(req.headers.apitoken, token)

    if (req.headers.apitoken !== token) {
        const error = new Error("Invalid Token");
        error.status = 401; 
        return next(error);
    }
  
    next();
  }