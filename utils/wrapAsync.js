module.exports = (fn)=>{
    return (req , res , next)=>{
        fn(req, res, next).catch(next); 
    }
}

// use to execute the fn function with the same parameters 