const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  //   const { authorization } = req.headers;
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    res.status(401).send({ message: "no authorization header" });
    return;
  }
  const token = authHeader.replace("Bearer ", "");
  jwt.verify(token, "joqwjibedvbadhe4hfneir", async (err, user) => {
    if (err) {
      res.status(401).send({ message: "token is invalid" });
      return;
    }
    req.user = user;
    next();
  });
}
exports.auth = auth;

// if (authHeader) {
// const token = authHeader.split(' ')[1];
//     const token = authHeader.replace("Bearer ", "");
//     jwt.verify(token, "joqwjibedvbadhe4hfneir", async (err, user) => {
//       if (err) {
//         res.status(401).send({ message: "token is invalid" });
//         return;
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.status(401).send({ message: "no authorization header" });
//     return;
//   }
// }
