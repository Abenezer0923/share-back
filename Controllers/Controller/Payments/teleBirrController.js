const telebirrPay = (req, res) => {
    try {
        // Purposebalck Telebirr Integration API
        // const pbe_telebirr_api = process.env.PBE_TELEBIRR_API;
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
            tranx_id:"KAPS_543566576",
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

module.exports = {
    telebirrPay
}