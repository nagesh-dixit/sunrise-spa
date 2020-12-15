/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import {
  withToken,
  fetchJson,
  makeConfig,
  baseUrl,
} from "./api";
import uuid from "uuid";

const payments = {
  createItem: withToken((body, accessToken) =>
    fetchJson(`${baseUrl}/payments/`, {
      ...makeConfig(accessToken),
      method: "POST",
      body: JSON.stringify(body),
    })
  ),
  updateItem: withToken(
    ({ id, version, amount, paymentMethod }, accessToken) =>
      //process.env.VUE_APP_ADYEN_MERCHANT_ACCOUNT
      fetchJson(`${baseUrl}/payments/${id}`, {
        ...makeConfig(accessToken),
        method: "POST",
        body: JSON.stringify({
          version,
          actions: [
            {
              action: "setCustomField",
              name: "makePaymentRequest",
              value: JSON.stringify({
                amount,
                reference: uuid(),
                paymentMethod,
                merchantAccount:
                  process.env
                    .VUE_APP_ADYEN_MERCHANT_ACCOUNT,
              }),
            },
            {
              action: "setStatusInterfaceCode",
              interfaceCode: "paid",
            },
          ],
        }),
      })
  ),
};

export default payments;
