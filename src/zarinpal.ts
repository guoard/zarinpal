import got, { Options } from 'got';

import config from './config';
import type {
  PaymentRequest,
  PaymentVerification,
  RefreshAuthority,
} from './types';

class ZarinPal {
  private client;

  constructor(
    public readonly MerchantID: string,
    public readonly sandbox = false,
    options?: Partial<Options>,
  ) {
    if (MerchantID.length !== config.merchantIDLength) {
      throw new Error(
        `The MerchantID must be ${config.merchantIDLength} Characters.`,
      );
    }

    this.MerchantID = MerchantID;
    this.sandbox = sandbox || false;

    this.client = got.extend({
      ...options,
      prefixUrl: sandbox ? config.sandbox : config.https,
      headers: {
        ...options?.headers,
        'Cache-Control': 'no-cache',
      },
    });
  }

  async PaymentRequest(input: PaymentRequest) {
    const response = await this.client
      .post(config.API.PR, {
        json: {
          MerchantID: this.MerchantID,
          ...input,
        },
      })
      .json<{
        Status: number;
        Authority: string;
      }>();

    return {
      status: response.Status,
      authority: response.Authority,
      url: config.PG(this.sandbox) + response.Authority,
    };
  }

  async PaymentVerification(input: PaymentVerification) {
    const response = await this.client
      .post(config.API.PV, {
        json: {
          MerchantID: this.MerchantID,
          ...input,
        },
      })
      .json<{
        Status: number;
        RefID: string;
      }>();

    return {
      status: response.Status,
      RefID: response.RefID,
    };
  }

  async UnverifiedTransactions() {
    const response = await this.client
      .post(config.API.UT, {
        json: {
          MerchantID: this.MerchantID,
        },
      })
      .json<{
        Status: number;
        Authorities: Array<string>;
      }>();

    return {
      status: response.Status,
      authorities: response.Authorities,
    };
  }

  async RefreshAuthority(input: RefreshAuthority) {
    const response = await this.client
      .post(config.API.RA, {
        json: {
          MerchantID: this.MerchantID,
          Authority: input.Authority,
          ExpireIn: input.Expire,
        },
      })
      .json<{
        Status: number;
      }>();

    return {
      status: response.Status,
    };
  }
}

function create(
  MerchantID: string,
  sandbox?: boolean,
  options?: Partial<Options>,
) {
  return new ZarinPal(MerchantID, sandbox, options);
}

export default ZarinPal;
export { create };
