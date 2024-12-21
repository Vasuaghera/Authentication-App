import jwt from "jsonwebtoken";

const userAuth = async (req , res , next) => {
    try{
        const {token} = req.cookies ;
        if(!token) {
            return res.json({
                success : false,
                message : 'Not authorized , please login again.'
            })
        }

        const jwtVerify = jwt.verify(token , process.env.JWT_SECRET) ;
        if(jwtVerify.id){
            req.body.userId = jwtVerify.id ;
        }
        else{
            return res.json({
                success : false ,
                message : 'Not authorized , please login again. in verify'
            })
        }

        next() ;
    }
    catch(error) {
        res.json({
            success:false ,
            message : error.message
        })
    }
}

export default userAuth ;