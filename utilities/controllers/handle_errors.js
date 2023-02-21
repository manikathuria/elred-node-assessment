module.exports = (error, res) => {
    console.error(error, ":error handler:\n")
    if (error &&
      error.response &&
      error.response.status == 401) return res.status(200).send({ 
        message : "Action not permitted",
        success : false,
        data : {}
      })
    if (error && error.response && error.response.status == 400) {
      return res.status(200).send({ 
          message : "Request has been blocked on our side",
          success : false,
          data : {}
        })  
      }
    return res.status(200).send({
      message : "Internal Server error, please contact your customer care",
      success : false,
      data : {}
    });
  }
  
  