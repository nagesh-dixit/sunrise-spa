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
  //@todo: remove, it is now just fetching existing to prevent
  //  making too many
  // createItem: withToken((body, accessToken) =>
  //   groupFetchJson(
  //     `${baseUrl}/payments/ccc3bb9f-83b7-466f-8cac-3622ec26692b`,
  //     makeConfig(accessToken)
  //   )
  // ),
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
