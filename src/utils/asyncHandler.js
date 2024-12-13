const asyncHandler =(requestHandler)=>{
   return (req, res, next)=>{
        Promise.resolve(requestHandler(req, res, next)).catch((err)=>next(err))
    }
}
//promise
//can also use catch and throw with async await
export {asyncHandler}