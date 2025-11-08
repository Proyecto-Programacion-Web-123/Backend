const path = require('path');

describe('orderModel module', () => {
  const modelPath = path.join(__dirname, '..', 'orderModel.js');
  let orderModel;

  test('se puede requerir sin lanzar errores', () => {
    expect(() => { orderModel = require(modelPath); }).not.toThrow();
  });

  test('exporta un objeto o función válido', () => {
    expect(orderModel).toBeTruthy();
    const t = typeof orderModel;
    expect(['object', 'function']).toContain(t);
  });

  test('si existen, las propiedades típicas son del tipo esperado', () => {
    if ('table' in orderModel) expect(typeof orderModel.table).toBe('string');
    if ('tableName' in orderModel) expect(typeof orderModel.tableName).toBe('string');
    if ('primaryKey' in orderModel) expect(
      ['string', 'object'].includes(typeof orderModel.primaryKey)
    ).toBe(true);
    if ('columns' in orderModel) expect(
      Array.isArray(orderModel.columns) || typeof orderModel.columns === 'object'
    ).toBe(true);
  });
});
