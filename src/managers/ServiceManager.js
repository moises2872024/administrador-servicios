import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dataFile = fileURLToPath(
  new URL('../data/services.json', import.meta.url)
);

const requiredFields = [
  'name',
  'description',
  'duration',
  'price',
  'category',
  'available'
];

export default class ServiceManager {
  constructor() {
    this.services = [];
    this.nextId = 1;
    this.ready = this.#loadServices();
  }

  async #loadServices() {
    try {
      const content = await readFile(dataFile, 'utf8');
      const parsed = JSON.parse(content);

      if (!Array.isArray(parsed)) {
        throw new Error(
          'El archivo services.json debe contener un arreglo.'
        );
      }

      this.services = parsed;

      this.nextId =
        parsed.reduce(
          (highest, service) =>
            Math.max(highest, Number(service.id) || 0),
          0
        ) + 1;
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.services = [];
        this.nextId = 1;
        await this.#saveServices();
        return;
      }

      throw new Error(
        `No se pudieron cargar los servicios: ${error.message}`
      );
    }
  }

  async #saveServices() {
    await writeFile(
      dataFile,
      `${JSON.stringify(this.services, null, 2)}\n`,
      'utf8'
    );
  }

  async getServices() {
    await this.ready;

    return this.services.map((service) => ({
      ...service
    }));
  }

  async getServiceById(id) {
    await this.ready;

    const service = this.services.find(
      (item) => item.id === Number(id)
    );

    return service ? { ...service } : null;
  }

  async addService(serviceData) {
    await this.ready;

    if (
      !serviceData ||
      typeof serviceData !== 'object' ||
      Array.isArray(serviceData)
    ) {
      throw new TypeError(
        'Debes proporcionar un objeto con los datos del servicio.'
      );
    }

    const missingFields = requiredFields.filter((field) => {
      if (!Object.hasOwn(serviceData, field)) {
        return true;
      }

      if (typeof serviceData[field] === 'string') {
        return !serviceData[field].trim();
      }

      return (
        serviceData[field] === null ||
        serviceData[field] === undefined
      );
    });

    if (missingFields.length > 0) {
      throw new Error(
        `Faltan campos obligatorios: ${missingFields.join(', ')}.`
      );
    }

    if (
      !Number.isFinite(Number(serviceData.duration)) ||
      Number(serviceData.duration) <= 0
    ) {
      throw new Error(
        'duration debe ser un número mayor que cero.'
      );
    }

    if (
      !Number.isFinite(Number(serviceData.price)) ||
      Number(serviceData.price) < 0
    ) {
      throw new Error(
        'price debe ser un número igual o mayor que cero.'
      );
    }

    if (typeof serviceData.available !== 'boolean') {
      throw new Error(
        'available debe ser true o false.'
      );
    }

    const newService = {
      id: this.nextId,
      name: String(serviceData.name).trim(),
      description: String(serviceData.description).trim(),
      duration: Number(serviceData.duration),
      price: Number(serviceData.price),
      category: String(serviceData.category).trim(),
      available: serviceData.available
    };

    this.services.push(newService);

    try {
      await this.#saveServices();
      this.nextId++;
    } catch (error) {
      this.services.pop();

      throw new Error(
        `No se pudo guardar el servicio: ${error.message}`
      );
    }

    return { ...newService };
  }

  async updateService(id, updatedData) {
    await this.ready;

    const index = this.services.findIndex(
      (service) => service.id === Number(id)
    );

    if (index === -1) {
      return null;
    }

    if (
      !updatedData ||
      typeof updatedData !== 'object' ||
      Array.isArray(updatedData)
    ) {
      throw new TypeError(
        'Debes proporcionar un objeto con los campos a actualizar.'
      );
    }

    // El ID original se conserva aunque se envíe otro ID.
    const { id: ignoredId, ...safeData } = updatedData;

    const current = this.services[index];

    const updated = {
      ...current,
      ...safeData,
      id: current.id
    };

    for (const field of requiredFields) {
      if (
        !Object.hasOwn(updated, field) ||
        updated[field] === null ||
        updated[field] === undefined ||
        (
          typeof updated[field] === 'string' &&
          !updated[field].trim()
        )
      ) {
        throw new Error(
          `El campo "${field}" no puede estar vacío.`
        );
      }
    }

    if (
      !Number.isFinite(Number(updated.duration)) ||
      Number(updated.duration) <= 0
    ) {
      throw new Error(
        'duration debe ser un número mayor que cero.'
      );
    }

    if (
      !Number.isFinite(Number(updated.price)) ||
      Number(updated.price) < 0
    ) {
      throw new Error(
        'price debe ser un número igual o mayor que cero.'
      );
    }

    if (typeof updated.available !== 'boolean') {
      throw new Error(
        'available debe ser true o false.'
      );
    }

    updated.name = String(updated.name).trim();
    updated.description = String(updated.description).trim();
    updated.duration = Number(updated.duration);
    updated.price = Number(updated.price);
    updated.category = String(updated.category).trim();

    this.services[index] = updated;

    try {
      await this.#saveServices();
    } catch (error) {
      this.services[index] = current;

      throw new Error(
        `No se pudo guardar la actualización: ${error.message}`
      );
    }

    return { ...updated };
  }

  async deleteService(id) {
    await this.ready;

    const index = this.services.findIndex(
      (service) => service.id === Number(id)
    );

    if (index === -1) {
      return null;
    }

    const [deletedService] = this.services.splice(index, 1);

    try {
      await this.#saveServices();
    } catch (error) {
      this.services.splice(index, 0, deletedService);

      throw new Error(
        `No se pudo guardar la eliminación: ${error.message}`
      );
    }

    return { ...deletedService };
  }
}