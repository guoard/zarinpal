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
    public readonly sandbox: boolean,
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
    const result = await this.client
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
      status: result.Status,
      authority: result.Authority,
      url: config.PG(this.sandbox) + result.Authority,
    };
  }

  async PaymentVerification(input: PaymentVerification) {
    const result = await this.client
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
      status: result.Status,
      RefID: result.RefID,
    };
  }

  async UnverifiedTransactions() {
    const result = await this.client
      .post(config.API.UT, {
        json: {
          MerchantID: this.MerchantID,
        },
      })
      .json<{
        Status: number;
        Authorities: string;
      }>();

    return {
      status: result.Status,
      authorities: result.Authorities
    };
  }

  async RefreshAuthority(input: RefreshAuthority) {
    const result = await this.client
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
      status: result.Status,
    };
  }
}

export const create = function (
  MerchantID: string,
  sandbox = false,
  options: Partial<Options>,
) {
  return new ZarinPal(MerchantID, sandbox, options);
};
