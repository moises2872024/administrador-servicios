
import { env } from './config/env.config.js';
import ServiceManager from './managers/ServiceManager.js';

const serviceManager = new ServiceManager();

async function main() {
  await serviceManager.ready;

  console.log(
    'Administrador de servicios iniciado correctamente.'
  );

  console.log(`Entorno: ${env.nodeEnv}`);
  console.log(`Puerto configurado: ${env.port}`);

  const services = await serviceManager.getServices();

  console.log(`Servicios cargados: ${services.length}`);
}

main().catch((error) => {
  console.error(
    `Error al iniciar la aplicación: ${error.message}`
  );

  process.exitCode = 1;
});
