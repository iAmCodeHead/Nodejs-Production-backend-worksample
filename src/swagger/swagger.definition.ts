import config from '../config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Perspective Work Sample API documentation',
    version: '0.0.1',
    description: 'This is a demonstration of node/typescript work sample',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
