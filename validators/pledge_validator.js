
const pledgeSchema = require("./schema/pledge.js");

module.exports = {
    ValidateCreation: async (req, res, next) => {
        //console.log(req.body)
        const value = await pledgeSchema.create_pledge.validate(req.body);
        if (value.error) {
            //console.log(req.body)
            return res.status(400).send({
                status: false,
                message: value.error.details[0].message,
            });
        }
        else{
            next();
        }
        
    },
}