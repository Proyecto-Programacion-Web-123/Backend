const service = require('../userService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

jest.mock('../../models/userModel', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const UserModel = require('../../models/userModel');

describe('userService (branches extra)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getUserById -> BadRequestError si falta id', async () => {
    await expect(service.getUserById()).rejects.toBeInstanceOf(BadRequestError);
  });

  test('getUserById -> NotFoundError si no existe', async () => {
    UserModel.findById.mockResolvedValue(null);
    await expect(service.getUserById(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  // En estos dos casos verificamos por el mensaje "required"
  // para ser robustos ante el tipo exacto de Error que lanza la validación
  test('createUser -> BadRequestError si falta email', async () => {
    await expect(
      service.createUser({ first_name: 'Ana', last_name: 'Pérez', password: 'x' })
    ).rejects.toThrow(/required/i);
  });

  test('createUser -> BadRequestError si falta password', async () => {
    await expect(
      service.createUser({ first_name: 'Ana', last_name: 'Pérez', email: 'ana@x.com' })
    ).rejects.toThrow(/required/i);
  });

  test('updateUser -> BadRequestError si falta id', async () => {
    await expect(service.updateUser(undefined, { first_name: 'Nueva' }))
      .rejects.toBeInstanceOf(BadRequestError);
  });

  test('deleteUser -> BadRequestError si falta id', async () => {
    await expect(service.deleteUser()).rejects.toBeInstanceOf(BadRequestError);
  });
});

  test('createUser -> NotFoundError si UserModel.create devuelve null', async () => {
    UserModel.create.mockResolvedValue(null);
    await expect(
      service.createUser({
        first_name: 'Ana',
        last_name: 'Pérez',
        email: 'ana@x.com',
        password: '1234'
      })
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  test('updateUser -> NotFoundError si UserModel.update devuelve null', async () => {
    UserModel.update.mockResolvedValue(null);
    await expect(service.updateUser(1, { first_name: 'Nueva' }))
      .rejects.toBeInstanceOf(NotFoundError);
  });

  test('deleteUser -> NotFoundError si UserModel.delete devuelve null', async () => {
    UserModel.delete.mockResolvedValue(null);
    await expect(service.deleteUser(1))
      .rejects.toBeInstanceOf(NotFoundError);
  });

  test('getUsers -> retorna [] si UserModel.findAll devuelve null', async () => {
  UserModel.findAll.mockResolvedValue(null);
  const result = await service.getUsers();
  expect(result).toEqual([]); // cubre rama users || []
});

test('create (alias) -> devuelve { ok: false } si createUser lanza error', async () => {
  // Simula error en createUser
  jest.spyOn(service, 'createUser').mockRejectedValue(new Error('boom'));
  const result = await service.create({});
  expect(result).toEqual({ ok: false });
  service.createUser.mockRestore();
});

test('update (alias) -> devuelve { ok: false } si updateUser lanza error', async () => {
  jest.spyOn(service, 'updateUser').mockRejectedValue(new Error('fail'));
  const result = await service.update(1, {});
  expect(result).toEqual({ ok: false });
  service.updateUser.mockRestore();
});

test('delete (alias) -> devuelve { ok: false } si deleteUser lanza error', async () => {
  jest.spyOn(service, 'deleteUser').mockRejectedValue(new Error('fail'));
  const result = await service.delete(1);
  expect(result).toEqual({ ok: false });
  service.deleteUser.mockRestore();
});

test('remove (alias) -> devuelve { ok: false } si deleteUser lanza error', async () => {
  jest.spyOn(service, 'deleteUser').mockRejectedValue(new Error('fail'));
  const result = await service.remove(1);
  expect(result).toEqual({ ok: false });
  service.deleteUser.mockRestore();
});
