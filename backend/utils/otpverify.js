export const verifyOTP = (token) => {
    const otp = req.body;
    if(token === otp){
        return false;
    }
    return true;
}