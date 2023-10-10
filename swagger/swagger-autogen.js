const swaggerAutogen=require('swagger-autogen')();

const outputFile='./swagger.json';

const endpointsFiles=['../routes/routesArticle.js','../routes/routesComment.js','../routes/routesProfiles.js','../routes/routesSubscriptions.js','../routes/routesTags.js','../routes/routesUser.js'];




const config={

    info:{

        title:'Blog API Documentation',

        description:'',

    },

    tags:[ ],

    host:'localhost:3000/api',

    schemes:['http','https'],

};

swaggerAutogen(outputFile,endpointsFiles,config)