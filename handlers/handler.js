function handleResponse (stat, msg, result = null) {
    return {
        status: stat,
        message: msg,
        data: result
    }
}

module.exports.handleResponse = handleResponse