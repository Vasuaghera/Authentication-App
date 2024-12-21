import bcrypt from 'bcryptjs' ;
import jwt from 'jsonwebtoken' ;
import user from '../models/user.js';
import userModel from '../models/user.js';
import transporter from '../config/nodemailer.js';

// For Registeration
export const register = async (req , res) => {
    const REGISTRATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
      color: #333;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .email-header {
      background-color: #4caf50;
      color: #ffffff;
      text-align: center;
      padding: 20px;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      line-height: 1.6;
    }
    .email-body p {
      margin: 10px 0;
    }
    .email-footer {
      text-align: center;
      padding: 15px;
      font-size: 12px;
      color: #666;
      background-color: #f1f1f1;
    }
    .btn {
      display: inline-block;
      background-color: #4caf50;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin-top: 15px;
    }
    .btn:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      Welcome to Authentication Web!
    </div>
    <div class="email-body">
      <p>Hi {{name}},</p>
      <p>Thank you for registering with us. We are thrilled to have you on board!</p>
      <p>Your registered email is: <strong>{{email}}</strong></p>
      <p>Feel free to explore our platform and let us know if you have any questions.</p>
      <p>
        <a href="https://example.com" class="btn">Visit Our Website</a>
      </p>
    </div>
    <div class="email-footer">
      &copy; 2024 Authentication Web. All Rights Reserved.
    </div>
  </div>
</body>
</html>

`;
    try {
        const {name , email , password} = req.body ;
        if(!name || !email || !password) {
            return res.json({
                success:false ,
                message : 'Value is Missing'
            })
        }
        const exisitngUser = await userModel.findOne({email})
        if(exisitngUser) {
            return res.json({
                success:false ,
                message : "User already exist" 
            });
        } 
        const hashedPass = await bcrypt.hash(password,10) ;
        const user = new userModel({
            name ,
            email ,
            password : hashedPass 
        }) ;
        await user.save();

        const token = jwt.sign({id:user._id} , process.env.JWT_SECRET, {
            expiresIn : '7d'
        });

        res.cookie('token' , token , {
            httpOnly : true ,
            // true for production and false for development
            secure : process.env.NODE_ENV === 'production', 
            // either stirict or none , working on local env then write a strict becz frnd and back both run on local host
            // In deployment both are running on diff domain name , so there is a none 
            sameSite : process.env.NODE_ENV === 'prodcution' ? 'none' : 'strict' ,
            maxAge : 7*24*60*60*1000 
        })

        // For Sending Welcome Email
        const mailSender = {
            from : process.env.SENDER_EMAIL ,
            to : email ,
            subject : 'Welcome to Authentication web' ,
            // text : `Welcome to Authentication website , Your Account has been created with Email ID : ${email}`,
            // html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
            html: REGISTRATION_EMAIL_TEMPLATE.replace('{{name}}', name).replace('{{email}}', email),
        }

        await transporter.sendMail(mailSender);

        return res.json({
            success : true ,
            message : 'Registration Successsfully'
        });
    }
    catch(error) {
        res.json({
            success:false ,
            message : error.message
        })
    }
}

// For Login
export const login = async (req,res) => {
    try {
        const {email , password} = req.body ;
        if(!email || !password) {
            return res.json({
                success:false ,
                message : 'Value is Missing'
            })
        }
        const existuser = await userModel.findOne({email}) ;
        if(!existuser) {
            return res.json({
                success : false ,
                message : 'User is not exist'
            })
        }

        const isMatch = await bcrypt.compare(password , existuser.password) ;
        if(!isMatch) {
            return res.json({
                success : false ,
                message : 'Password is Invalid'
            });
        }
        
        const token = jwt.sign({id:existuser._id} , process.env.JWT_SECRET, {
            expiresIn : '7d'
        });

        res.cookie('token' , token , {
            httpOnly : true ,
            // true for production and false for development
            secure : process.env.NODE_ENV === 'production', 
            // either stirict or none , working on local env then write a strict becz frnd and back both run on local host
            // In deployment both are running on diff domain name , so there is a none 
            sameSite : process.env.NODE_ENV === 'prodcution' ? 'none' : 'strict' ,
            maxAge : 7*24*60*60*1000 
        })

        return res.json({
            success : true ,
            message : 'Login Successsfully'
        });

    }
    catch(error) {
        res.json({
            success:false ,
            message : "Catch Error in Login Controller" 
        })
    }
}

// For Logout
export const logout = async (req,res) => {
    try {
        // Clear cookie
        res.clearCookie('token' , {
            httpOnly : true ,
            // true for production and false for development
            secure : process.env.NODE_ENV === 'production', 
            // either stirict or none , working on local env then write a strict becz frnd and back both run on local host
            // In deployment both are running on diff domain name , so there is a none 
            sameSite : process.env.NODE_ENV === 'prodcution' ? 'none' : 'strict' 
        })

        return res.json({
            success : true  , 
            message : "Logout Successfully"
        });
    }
    catch(error) {
        res.json({
            success:false ,
            message : error.message
        })
    }
}

// For sending Verification otp on email
export const sendVerifyotp = async (req , res) => {
    try {
        const {userId} = req.body ;
        const user = await userModel.findById(userId) ;
        if(user.isAccountVerified) {
            return res.json({
                success : false ,
                message : "User account already verified" 
            })
        }
        // Six digit otp generate
        const otp = String(Math.floor(100000 + Math.random()* 900000));
        user.verifyotp = otp ;
        user.verifyotpExpireAt = Date.now() + 1*60*60*1000 ;
        
        await user.save() ;

        const mailSender = {
            from : process.env.SENDER_EMAIL ,
            to : user.email ,
            subject : 'Account Verification otp for Authentication web' ,
            text : `Your otp is ${otp} , Verify your account using this otp.` 
       
        }

        await transporter.sendMail(mailSender) ;

        res.json({
            success : true ,
            message : "Verification otp sent successfully on your E-mail" 
        });
    }
    catch(error) {
        res.json({
            success:false ,
            message : error.message
        })
    }
}

// For verify email from verification otp
export const verifyEmail = async (req , res) => {
    try {
        const {userId , otp} = req.body ;
        if(!userId) {
            return res.json({
                success : false ,
                message : "User is not avialable"
            })
        }
        if(!otp){
            return res.json({
                success : false ,
                message : "otp is Missing"
            })
        }
        
        const user = await userModel.findById(userId) ;
        

        if(!user) {
            return res.json({
                success : false,
                message : 'User not found'
            });
        }

        if(user.verifyotp === '') {
            return res.json({
                success : false ,
                message : 'Please fill the otp'
            })
        }
        if(user.verifyotp !== otp) {
            return res.json({
                success : false ,
                message : 'otp is invalid'
            })
        }
        if(user.verifyotpExpireAt < Date.now()) {
            return res.json({
                success : false ,
                message : 'otp expired'
            })
        }

        user.isAccountVerified = true ;
        user.verifyotp = '' ;
        user.verifyotpExpireAt = 0 ;

        await user.save() ;

        return res.json({
            success : true ,
            message : 'Email verified successfully'
        })
    }
    catch(error) {
        res.json({
            success:false ,
            message : error.message
        })
    }
}

// For cheking is user already authenicated or not
export const isAuthenticated = async (req , res) => {
    try {
        return res.json({
            success : true ,
            message : "User authenicated" 
        })
    }
    catch(error) {
        res.json({
            success:false ,
            message : error.message
        })
    }
}

// For send password reset otp
export const sendResetotp = async (req , res) => {
    try {
        const {email} = req.body ;
        if(!email) {
            return res.json({
                success : false ,
                message : "Email is required"
            })
        }

        const user = await userModel.findOne({email}) ;
        if(!user) {
            return res.json({
                success : false,
                message: 'User is not present'
            })
        }

        const otp = String(Math.floor(100000 + Math.random()* 900000));
        user.resetotp = otp ;
        user.restotpExpireAt = Date.now() + 15*60*1000 ;

        await user.save() ;

        const mailSender = {
            from : process.env.SENDER_EMAIL ,
            to : user.email ,
            subject : 'Reset Password otp for Authentication web' ,
            text : `Your otp is ${otp} for Reseting your password.`
        }

        await transporter.sendMail(mailSender) ;

        return res.json({
            success : true ,
            message : "otp sent Successfully for reseting password"
        })
    }
    catch(error) {
        res.json({
            success:false ,
            message : error.message
        })
    }
}

// For verification reset otp
export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.json({
                success: false,
                message: "All fields are required: email, otp, and new password",
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User not found",
            });
        }

        if (user.resetotp !== otp) {
            return res.json({
                success: false,
                message: "Invalid otp",
            });
        }

        if (user.restotpExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "otp has expired",
            });
        }

        const hashedPass = await bcrypt.hash(newPassword, 10);
        user.password = hashedPass;
        user.resetotp = "";
        user.restotpExpireAt = null;

        await user.save();

        return res.json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
};


