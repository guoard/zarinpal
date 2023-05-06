import anyTest, {TestFn} from 'ava';

import { create } from '../src/index';
import ZarinPal from '../src/zarinpal';


const test = anyTest as TestFn<{zarinpal: ZarinPal}>;

test.before((t) => {
  t.context.zarinpal = create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);
});

test('should throw error if merchant id not 36 character', (t) => {
  const err = t.throws(() => {
    create('x');
  });
  t.is(err?.message, 'The MerchantID must be 36 Characters.');
});

test('should be able to get authority', async (t) => {
  const zarinpal = create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true);
  const response = await zarinpal.PaymentRequest({
    Amount: '1000',
    CallbackURL: 'http://localhost',
    Description: 'test',
    Email: 'test@test.ir',
    Mobile: '09120000000',
  });

  t.is(response.status, 100);
});
