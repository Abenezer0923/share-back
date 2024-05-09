const axios = require('axios')

const home = (req,res) => {
    res.status(200).json({data:"integrating"})
}

const telebirr_pay = (req, res) => {
    try {
        // Purposebalck Telebirr Integration API
        // const pbe_telebirr_api = process.env.PBE_TELEBIRR_API;
        const tranx_id= "KAPS_549234507909876576"; 

        const pbe_telebirr_api = "https://telebirr.purposeblacketh.com/";
        // const notify_url = process.env.KAPS_TELEBIRR_NOTIFY_URL;
    
        // Destructure the value
        // const { subject, amount, tranx_id } = req.body;
    
        const return_url = "http://www.google.com/" + tranx_id;
        // const new_data = {
        //   subject,
        //   amount,
        //   tranx_id,
        //   return_url,
        // };
        
        const new_data = {
            subject:"share",
            amount:12,
            tranx_id,
            return_url,
          };
        // Sending a post request to the api endpoint
        axios
          .post(pbe_telebirr_api + "telebirr/payer", new_data)
          .then((response) => {
            // This returns a response
            res.status(200).json({ data: response.data });
          })
          .catch((error) => {
            console.error("Error Sending Payment Request:", error);
            // This returns a error
            res.status(200).json({ error });
          });
      } catch (error) {
        // handleErrors(error, res);
        console.log({error})
      }
}
const arifPay_pay = async (req, res) => {
    // Make an API call to initiate the payment process
    const response = await axios.post(
      "https://payment.purposeblacketh.com/arif-pay/api/payer",
      req.body
    );

    console.log({res:response.data})
    res.json(response.data)

   
}

const arifpay_callback = (req,res) => {
  
  const {orderId} = req.body;
}





const telebirr_success = (req,res) => {
    // Do telebirr  success logic here
}

const telebirr_notifier = (req,res) => {
    // Do telebirr notify logic here
}


module.exports = {
    telebirr_pay,home,
    arifPay_pay,arifpay_callback
}