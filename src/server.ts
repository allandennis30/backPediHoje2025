import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import YAML from 'yamljs';

const PORT = process.env.PORT || 3000;

const swaggerDocument = YAML.load('./src/docs/swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 Swagger docs available at http://localhost:${PORT}/docs`);
});