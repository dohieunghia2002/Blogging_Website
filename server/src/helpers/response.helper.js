export const errorResponse = (message, statusCode) => {
    return {
        success: false,
        message,
        statusCode
    }
}

export const successResponse = (message, data, statusCode = 200) => {
    return {
        success: true,
        message,
        data,
        statusCode
    }
}