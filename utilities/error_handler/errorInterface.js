const errorDefaultResponse = (message, success, data) => {
    return (res.status(200).send({
        message,
        success,
        data
      }));
}

module.exports = {
    errorDefaultResponse
}