export type PaymentRequest = {
  Amount: string;
  CallbackURL: string;
  Description: string;
  Email: string;
  Mobile: string;
};

export type PaymentVerification = {
  Amount: string;
  Authority: string;
};

export type RefreshAuthority = { Expire: string; Authority: string };
