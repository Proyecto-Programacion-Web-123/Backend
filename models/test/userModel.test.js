const path = require('path');

describe('userModel module', () => {
  const modelPath = path.join(__dirname, '..', 'userModel.js');
  let userModel;

  test('se puede requerir sin lanzar errores', () => {
    expect(() => { userModel = require(modelPath); }).not.toThrow();
  });

  test('exporta un objeto o función válido', () => {
    expect(userModel).toBeTruthy();
    const t = typeof userModel;
    expect(['object', 'function']).toContain(t);
  });

  test('si existen, las propiedades típicas son del tipo esperado', () => {
    if ('table' in userModel) expect(typeof userModel.table).toBe('string');
    if ('tableName' in userModel) expect(typeof userModel.tableName).toBe('string');
    if ('primaryKey' in userModel) expect(
      ['string', 'object'].includes(typeof userModel.primaryKey)
    ).toBe(true);
    if ('columns' in userModel) expect(
      Array.isArray(userModel.columns) || typeof userModel.columns === 'object'
    ).toBe(true);
  });
});
