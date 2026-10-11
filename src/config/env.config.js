import dotenv from 'dotenv';

dotenv.config();

const requiredVariables = ['PORT', 'NODE_ENV'];

const missingVariables = requiredVariables.filter(
  (variable) =>
    !process.env[variable] ||
    !process.env[variable].trim()
);

if (missingVariables.length > 0) {
  throw new Error(
    `Faltan variables de entorno requeridas: ${missingVariables.join(', ')}. ` +
    'Revisa el archivo .env y compáralo con .env.example.'
  );
}

const port = Number(process.env.PORT);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(
    'La variable PORT debe ser un número entero entre 1 y 65535.'
  );
}

export const env = {
  port,
  nodeEnv: process.env.NODE_ENV
};