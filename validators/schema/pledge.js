const joi = require('@hapi/joi');

const schema = {
    create_pledge: joi.object({

            first_name: joi.string().required(),
            last_name: joi.string().required(),
            contact_person: joi.string().required(),
            address: joi.string().required(),
            house_number: joi.string().required(),
            state: joi.string().required(),
            city: joi.string().required(),
            country: joi.string().required(),
            zipcode: joi.string().required(),
            email: joi.string().required(),
            phone: joi.string().required(),
            stock_amount: joi.string().required(),
            share_amount: joi.string().required(),
            member: joi.boolean().required(),
    }),
}
module.exports = schema