const  asyncHandler=require('express-async-handler');
const  User =require('../../../Models/Auth/userModel');
const  bcrypt =require("bcrypt");
const  jwt =require("jsonwebtoken");
// Desc :register users;
// Route: api/user/register
// access public
const registeUser=asyncHandler (async(req,res)=>{
    try {
    const {phone, email, password,role}=req.body;
    const user=await User.findOne({email:email});
    if(user){
        console.log("user alredy exist");
    }
  const hashedPassword =bcrypt.hashSync(password,10); 
   const saveUser=new User({
    phone, email, role,password :hashedPassword
   });
   const newUser= await saveUser.save();
    const token=jwt.sign({
        _id:newUser._id},"secretkey123",{expiresIn:"1d"});
        res.status(201).json({
            status:"success",
            message:"user registered SuccesFully",
            token,
        })
   } catch (error) {
   console.log(error);
   }
  });
// Desc :login users;
// Route: api/user/login
// access public
const loginUser=asyncHandler (async(req,res)=>{
    const { email, password } = req.body;
    try {
      // Find the user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      const userRole=user.role;
  if(userRole=="ADM" ||userRole== "finance"){
    
      // Generate JWT token
      const token = jwt.sign({ userId: user._id },
        process.env.JWT_SECRET,
       {expiresIn:'35m'});
 
     return res.status(200).json({ token });
  }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
});
// Desc :Current users;
// Route: api/user/Current
// access private
const currentUser = async (token) => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token not found in local storage');
          }
          const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
          const email = decodedToken.email;
          console.log(email);
          return email;
        } catch (error) {
          console.log('Error decoding token:', error);
          return null;
        }
    }
const verifayUser=async(req,rs,next)=>{
    const token=req.cookies.token;
    if(!token){
        console.log("token no found");
    }
    else{
        jwt.verify(token,process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                console.log("token not found");
            }
        })
    }
}

// const logout = async () => {
//   // Clear the authentication token from local storage
//   localStorage.removeItem('token');
//   // Redirect the user to the login page
//   window.location.href = '/admin/login';
// }
module.exports={registeUser,loginUser,currentUser,verifayUser}