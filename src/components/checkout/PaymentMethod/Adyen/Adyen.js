/**
 * To use this component set the VUE_APP_USE_ADYEN to 1
 * in your environment variables
 * Manage payments scope is needed when creating api key in merchant center
 */

import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import payments from "../../../../api/payments";
import { locale } from "../../../common/shared";

const clientKey = process.env.VUE_APP_ADYEN_CLIENT_KEY;
if (!clientKey) {
  throw new Error(
    "Expected VUE_APP_ADYEN_CLIENT_KEY environment value"
  );
}
const amountToAiden = (amount) => ({
  currency: amount.currencyCode,
  value: amount.centAmount, // 100,
});
export default {
  props: { amount: Object },
  data: () => ({
    loading: true,
    paid: false,
  }),
  mounted() {
    payments
      .createItem({
        // externalId: "123456",
        // interfaceId: "789011",
        amountPlanned: this.amount,
        paymentMethodInfo: {
          paymentInterface: "ctp-adyen-integration",
          method: "CREDIT_CARD",
          name: {
            en: "Credit Card",
          },
        },
        custom: {
          type: {
            typeId: "type",
            key:
              "ctp-adyen-integration-web-components-payment-type",
          },
          fields: {
            getPaymentMethodsRequest: JSON.stringify({
              countryCode: "AU",
              shopperLocale: locale(),
              amount: amountToAiden(this.amount),
            }),
          },
        },
      })
      .then((payment) => {
        const configuration = {
          paymentMethodsResponse: JSON.parse(
            payment.custom.fields.getPaymentMethodsResponse
          ),
          clientKey,
          locale: locale(this),
          showPayButton: true,
          amount: amountToAiden(this.amount),
          environment: "test",
          onSubmit: (result) => {
            this.loading = true;
            if (!result.isValid) {
              throw new Error("Implement reject");
            }
            payments
              .updateItem({
                id: payment.id,
                version: payment.version,
                amount: amountToAiden(
                  payment.amountPlanned
                ),
                paymentMethod: result.data.paymentMethod,
              })
              .then((result) => {
                this.loading = false;
                this.paid = true;
              });
          },
        };
        const checkout = new AdyenCheckout(configuration);
        const card = checkout
          .create("card")
          .mount(this.$refs.adyen);
        this.loading = false;
      });
  },
};
