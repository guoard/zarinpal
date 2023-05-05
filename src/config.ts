const config = {
  https: 'https://www.zarinpal.com/pg/rest/WebGate/',
  sandbox: 'https://sandbox.zarinpal.com/pg/rest/WebGate/',
  merchantIDLength: 36,
  API: {
    PR: 'PaymentRequest.json',
    PRX: 'PaymentRequestWithExtra.json',
    PV: 'PaymentVerification.json',
    PVX: 'PaymentVerificationWithExtra.json',
    RA: 'RefreshAuthority.json',
    UT: 'UnverifiedTransactions.json',
  },
  PG: function (sandbox: boolean) {
    if (sandbox) {
      return 'https://sandbox.zarinpal.com/pg/StartPay/';
    }
    return 'https://www.zarinpal.com/pg/StartPay/';
  },
};

export default config;
