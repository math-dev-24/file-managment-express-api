import express from 'express';
import userRoute from "./routes/userRoute";
import fileRoute from "./routes/fileRoute";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de gestionnaire de fichiers',
            version: '1.0.0',
            description: 'API pour la gestion des utilisateurs et des fichiers',
        },
        tags: [
            {
                name: 'Public',
                description: 'Public API'
            },
            {
                name: 'Protected',
                description: 'API protégée'
            }
        ],
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Serveur de développement',
            },
        ],
        components: {
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
    },
    apis: ['./src/**/*.ts']
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/user', userRoute);
app.use('/file', fileRoute);


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
