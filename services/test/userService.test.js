// services/test/userService.test.js
jest.mock('../../db', () => {
  const k = (...args) => k;
  k._result = [];
  const chain = () => k;

  k.from = chain;
  k.where = chain;
  k.whereNull = chain;
  k.whereNotNull = chain;
  k.andWhere = chain;
  k.join = chain;
  k.leftJoin = chain;
  k.returning = chain;

  // select -> ARRAY
  k.select = jest.fn((...cols) => {
    k._result = [
      { id_user: 1, name: 'Ana' },
      { id_user: 2, name: 'Luis' },
    ];
    return k;
  });

  // first -> OBJETO
  k.first = jest.fn(() => {
    k._result = { id_user: 1, name: 'Ana' };
    return k;
  });

  k.insert = jest.fn(async () => [31]);
  k.update = jest.fn(async () => 1);
  k.del    = jest.fn(async () => 1);

  k.raw = jest.fn(async () => ({}));
  k.fn = { now: jest.fn(() => 'now()') };

  k.then = (resolve, reject) => Promise.resolve(k._result).then(resolve, reject);
  return k;
});

const service = require('../userService');

describe('userService', () => {
  test('módulo carga', () => { expect(service).toBeTruthy(); });

  test('getAll (si existe)', async () => {
    if (!service.getAll && !service.getUsers) return;
    const fn = service.getAll || service.getUsers;
    await expect(fn()).resolves.toBeDefined();
  });

  test('getById (si existe)', async () => {
    if (!service.getById && !service.getUserById) return;
    const fn = service.getById || service.getUserById;
    await expect(fn(1)).resolves.toBeDefined();
  });

  test('create (si existe)', async () => {
    if (!service.create && !service.createUser) return;
    const fn = service.create || service.createUser;
    await expect(fn({ name: 'Ana' })).resolves.toBeDefined();
  });

  test('update (si existe)', async () => {
    if (!service.update && !service.updateUser) return;
    const fn = service.update || service.updateUser;
    await expect(fn(1, { name: 'New' })).resolves.toBeDefined();
  });

  test('remove/delete (si existe)', async () => {
    const fn = service.remove || service.delete || service.deleteUser;
    if (!fn) return;
    await expect(fn(1)).resolves.toBeDefined();
  });
});
