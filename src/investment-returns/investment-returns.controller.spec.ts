import { InvestmentReturnsController } from './investment-returns.controller.js';
describe('InvestmentReturnsController', () => {
  it('is defined with its existing service', () => {
    expect(new InvestmentReturnsController({} as any)).toBeDefined();
  });
});
