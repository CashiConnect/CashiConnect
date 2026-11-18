import { InvestmentsController } from './investments.controller.js';
describe('InvestmentsController', () => {
  it('is defined with its existing service', () => {
    expect(new InvestmentsController({} as any)).toBeDefined();
  });
});
