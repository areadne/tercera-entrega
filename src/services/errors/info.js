export const generateUserErrorInfo = (data) => {
    return `Uno o mas parámetros estan incompletos o no son válidos.
    - title: Must be a string. (${data.title})
    - description: Must be a number. (${data.description})
    - price: Must be a number. (${data.price})
    - stock: Must be a number. (${data.stock})
    - code: Must be a number. (${data.code})
    - category: Must be a string. (${data.category})`
}