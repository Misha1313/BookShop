const swaggerAutogen = require('swagger-autogen')()

const generateDocs = async () => {
    const outputFile = './swagger_output.json'
    const endpointsFiles = ['./routes/auth.js'];

    try {
        console.log('gela');
        return swaggerAutogen(outputFile, endpointsFiles);


    } catch (err) {
        console.log(err);
    }

    
}
generateDocs();
// module.exports = generateDocs;