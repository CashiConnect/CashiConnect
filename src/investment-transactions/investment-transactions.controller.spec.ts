import { InvestmentTransactionsController } from './investment-transactions.controller.js';
describe('InvestmentTransactionsController', () => {
  it('is defined with its existing service', () => {
    expect(new InvestmentTransactionsController({} as any)).toBeDefined();
  });
});
