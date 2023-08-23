//async errors are required to be handled diffrently as default error handling doent perform much
//for async errors and returns unhandled promise exception and breaks the code

//it takes a func as argument and executes it in try catch manner and passes error to next

module.exports= func=>
{
   return (req,res,next)=>
    {
        func(req,res,next).catch(next)
    }
}