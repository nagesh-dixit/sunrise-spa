/* eslint-disable no-shadow */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
import {
  withToken,
  groupFetchJson,
  makeConfig,
  baseUrl,
} from "./api";
import uuid from "uuid";

const payments = {
  createItem: withToken((body, accessToken) =>
    groupFetchJson(`${baseUrl}/payments/`, {
      ...makeConfig(accessToken),
      method: "POST",
      body: JSON.stringify(body),
    })
  ),
  updateItem: withToken(
    ({ id, version, amount, paymentMethod }, accessToken) =>
      //process.env.VUE_APP_ADYEN_MERCHANT_ACCOUNT
      groupFetchJson(`${baseUrl}/payments/${id}`, {
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
          ],
        }),
      })
  ),
};

export default payments;
