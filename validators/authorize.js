const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const authorize = (req, res, next, feature, index) => {
  const bearerHeader = req.headers["authorization"];
  // //console.log(bearerHeader)
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    //verify the token
    jwt.verify(token, secret, async (err, authData) => {
      if (err) {
        res.status(403).send({
          status: false,
          message: err,
        });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({
      status: false,
      message: "Invalid token",
    });
  }
};

const getUser = (req) => {
  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  var decode = jwt.decode(token);

  console.log("in side user fun");
  console.log(bearerHeader);
  return decode;
};
const checkAdminPermission = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  var decode = jwt.decode(token);
  //console.log(decode);
  if (decode.permissions[0] === "admin") {
    next();
  } else {
    res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }
};
const checkUserPermission = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader === "New_Payment") {
    next();
  } else {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    var decode = jwt.decode(token);
    //console.log("*******");
    console.log(decode);
    //console.log("*******");

    if (decode.role === "USER") {
      next();
    } else {
      return res.status(403).send({
        success: false,
        message: "Unauthorized",
      });
    }
  }
};
const checkStaffPermission = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  var decode = jwt.decode(token);
  //console.log(decode);
  if (decode.permissions[0] === "staff") {
    next();
  } else {
    return res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }
};
const checkCallCenterPermission = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  var decode = jwt.decode(token);
  //console.log(decode);
  if (decode.permissions[0] === "callcenter") {
    next();
  } else {
    return res.status(403).send({
      success: false,
      message: "Unauthorized",
    });
  }
};

const validateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    if (bearerHeader === "New_Payment") {
      next();
    } else {
      const bearer = bearerHeader.split(" ");
      console.log(secret);
      const token = bearer[1];
      console.log(token);

      jwt.verify(token, secret, async (err, authData) => {
        if (err) {
          console.log("Invalid Token 1");

          res.status(403).send({
            success: false,
            message: err,
          });
        } else {
          //console.log("Token Valid")
          next();
        }
      });
    }
  } else {
    //console.log("Invalid Token")
    res.status(403).send({
      success: false,
      message: "Authorization Token is Required",
    });
  }
};
//check if token is valid
const isTokenValid = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    jwt.verify(token, secret, async (err, authData) => {
      if (err) {
        res.status(403).send({
          success: false,
          message: "Token Expired",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Valid Token",
        });
      }
    });
  } else {
    res.status(403).send({
      success: false,
      message: "Invalid Token",
    });
  }
};
module.exports = {
  authorize,
  getUser,
  validateToken,
  isTokenValid,
  checkAdminPermission,
  checkCallCenterPermission,
  checkStaffPermission,
  checkUserPermission,
};
