const packageinfo=require("../../package.json");


function errorHandler(err, req, res, next) {
    //console.log(err)
    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).
        json({
            success:false,
            message: 'Unauthorized',
            description:'You dont Have Permission On This Route!'
        });
    }
    if (err.name === 'TypeError') {
        return res.status(500).
        json({
            success:false,
            message: 'Internal Server Error'
        });
    }
    return res.status(400).json({ 
        message: err.message ,
        version:packageinfo.version,
        build: process.env.NODE_ENV
    });

}
module.exports = errorHandler;