import jwt from "jsonwebtoken"


export const authenticateToken = (request, response, next) => {
    const token = request.headers['authorization'];

    if (!token) return response.status(403).send('Token is required');
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return response.status(403).send('Invalid token');
      request.user = user;
      console.log(user)
      next();
    });
  };

