const path = require('path');

describe('productModel module', () => {
  const modelPath = path.join(__dirname, '..', 'productModel.js');
  let productModel;

  test('se puede requerir sin lanzar errores', () => {
    expect(() => { productModel = require(modelPath); }).not.toThrow();
  });

  test('exporta un objeto o función válido', () => {
    expect(productModel).toBeTruthy();
    const t = typeof productModel;
    expect(['object', 'function']).toContain(t);
  });

  test('si existen, las propiedades típicas son del tipo esperado', () => {
    if ('table' in productModel) expect(typeof productModel.table).toBe('string');
    if ('tableName' in productModel) expect(typeof productModel.tableName).toBe('string');
    if ('primaryKey' in productModel) expect(
      ['string', 'object'].includes(typeof productModel.primaryKey)
    ).toBe(true);
    if ('columns' in productModel) expect(
      Array.isArray(productModel.columns) || typeof productModel.columns === 'object'
    ).toBe(true);
  });
});
