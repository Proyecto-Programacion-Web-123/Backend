const path = require('path');

describe('order_detailModel module', () => {
  const modelPath = path.join(__dirname, '..', 'order_detailModel.js');
  let orderDetailModel;

  test('se puede requerir sin lanzar errores', () => {
    expect(() => { orderDetailModel = require(modelPath); }).not.toThrow();
  });

  test('exporta un objeto o función válido', () => {
    expect(orderDetailModel).toBeTruthy();
    const t = typeof orderDetailModel;
    expect(['object', 'function']).toContain(t);
  });

  test('si existen, las propiedades típicas son del tipo esperado', () => {
    if ('table' in orderDetailModel) expect(typeof orderDetailModel.table).toBe('string');
    if ('tableName' in orderDetailModel) expect(typeof orderDetailModel.tableName).toBe('string');
    if ('primaryKey' in orderDetailModel) expect(
      ['string', 'object'].includes(typeof orderDetailModel.primaryKey)
    ).toBe(true);
    if ('columns' in orderDetailModel) expect(
      Array.isArray(orderDetailModel.columns) || typeof orderDetailModel.columns === 'object'
    ).toBe(true);
  });
});
