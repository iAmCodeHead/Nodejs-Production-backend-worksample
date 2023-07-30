import swaggerJSDoc from 'swagger-jsdoc';
import { Application } from 'express';
import swaggerUI from 'swagger-ui-express';

// Initialize swagger-jsdoc
const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
  },
  apis: ['../routes/*.ts'], // Replace with the path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

// Function to set up Swagger UI in the Express app
const setupSwagger = (app: Application): void => {
  // Serve the Swagger UI at /api-docs endpoint
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
}

export default setupSwagger;