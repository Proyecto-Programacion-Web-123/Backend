const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.send = jest.fn(() => res);
  return res;
};

// Mock de los errores
jest.mock('../../utils/errors', () => ({
  BadRequestError: class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestError';
    }
  },
  NotFoundError: class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
    }
  }
}));

// Mock del servicio
jest.mock('../../services/userService', () => ({
  getUsers: jest.fn(),
  getUserById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
}));

const controller = require('../userController');
const userService = require('../../services/userService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

describe('userController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de éxito', () => {
    test('getAll -> 200', async () => {
      userService.getUsers.mockResolvedValue([{ id_user: 1 }]);
      const res = makeRes();
      await controller.getAll({}, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id_user: 1 }]);
    });

    test('getById -> 200', async () => {
      userService.getUserById.mockResolvedValue({ id_user: 2 });
      const res = makeRes();
      await controller.getById({ params: { id: '2' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id_user: 2 });
    });

    test('create -> 201', async () => {
      userService.createUser.mockResolvedValue([31]);
      const res = makeRes();
      await controller.create({ body: { name: 'Ana' } }, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith([31]);
    });

    test('update -> 200', async () => {
      userService.updateUser.mockResolvedValue(1);
      const res = makeRes();
      await controller.update({ params: { id: '1' }, body: { name: 'New' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(1);
    });

    test('delete -> 204', async () => {
      userService.deleteUser.mockResolvedValue(1);
      const res = makeRes();
      await controller.delete({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('Manejo de errores', () => {
    test('getAll -> 500 en error interno', async () => {
      userService.getUsers.mockRejectedValue(new Error('DB Error'));
      const res = makeRes();
      await controller.getAll({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    test('getById -> 404 cuando no se encuentra', async () => {
      userService.getUserById.mockRejectedValue(new NotFoundError('User not found'));
      const res = makeRes();
      await controller.getById({ params: { id: '99' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('getById -> 400 cuando ID es inválido', async () => {
      userService.getUserById.mockRejectedValue(new BadRequestError('Invalid ID'));
      const res = makeRes();
      await controller.getById({ params: { id: 'invalid' } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID' });
    });

    test('create -> 400 cuando body es inválido', async () => {
      userService.createUser.mockRejectedValue(new BadRequestError('Name is required'));
      const res = makeRes();
      await controller.create({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name is required' });
    });

    test('update -> 404 cuando usuario no existe', async () => {
      userService.updateUser.mockRejectedValue(new NotFoundError('User not found'));
      const res = makeRes();
      await controller.update({ params: { id: '99' }, body: { name: 'New' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('delete -> 404 cuando usuario no existe', async () => {
      userService.deleteUser.mockRejectedValue(new NotFoundError('User not found'));
      const res = makeRes();
      await controller.delete({ params: { id: '99' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('delete -> 500 en error interno', async () => {
      userService.deleteUser.mockRejectedValue(new Error('DB Error'));
      const res = makeRes();
      await controller.delete({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('Edge cases', () => {
    test('getById con params undefined', async () => {
      userService.getUserById.mockResolvedValue({ id_user: 1 });
      const res = makeRes();
      await controller.getById({}, res); // Sin params
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('create con body undefined', async () => {
      userService.createUser.mockResolvedValue([31]);
      const res = makeRes();
      await controller.create({}, res); // Sin body
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('update con body y params undefined', async () => {
      userService.updateUser.mockResolvedValue(1);
      const res = makeRes();
      await controller.update({}, res); // Sin params ni body
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});