/**
 * To use this component you need to do the following:
 * set up the api extension for adyen
 * https://github.com/commercetools/commercetools-adyen-integration
 *
 * Set the folling environment variables:
 * VUE_APP_USE_ADYEN=1
 * VUE_APP_ADYEN_CLIENT_KEY=client key (from adyen)
 * VUE_APP_ADYEN_MERCHANT_ACCOUNT=merchant account (from adyenn)
 * VUE_APP_ADYEN_INTEGRATION=key of the extension: https://docs.commercetools.com/api/projects/api-extensions#extension
 * VUE_APP_ADYEN_TYPE=key of the custom type: https://docs.commercetools.com/api/projects/types#type
 *
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
    error: false,
  }),
  computed: {
    showComponent() {
      return !this.loading && !this.paid && !this.error;
    },
    showLoading() {
      return this.loading && !this.error;
    },
    showPaid() {
      return this.paid;
    },
    showError() {
      return !this.paid && this.error;
    },
  },
  methods: {
    retry() {
      this.error = false;
      this.onMount();
    },
    onMount() {
      if (this.error) {
        return;
      }
      payments
        .createItem({
          amountPlanned: this.amount,
          paymentMethodInfo: {
            paymentInterface:
              process.env.VUE_APP_ADYEN_INTEGRATION,
            method: "CREDIT_CARD",
            name: {
              en: "Credit Card",
            },
          },
          custom: {
            type: {
              typeId: "type",
              key: process.env.VUE_APP_ADYEN_TYPE,
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
              payment.custom.fields
                .getPaymentMethodsResponse
            ),
            clientKey,
            locale: locale(this),
            showPayButton: true,
            amount: amountToAiden(this.amount),
            environment: "test",
            onSubmit: (result) => {
              this.loading = true;
              if (!result.isValid) {
                this.error = true;
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
                  if (result.satusCode) {
                    return Promise.reject();
                  }
                  this.loading = false;
                  this.paid = true;
                  this.$emit("card-paid", result.id);
                })
                .catch(() => (this.error = true));
            },
          };
          const checkout = new AdyenCheckout(configuration);
          const card = checkout
            .create("card")
            .mount(this.$refs.adyen);
          this.loading = false;
        })
        .catch(() => (this.error = true));
    },
  },
  mounted() {
    this.onMount();
  },
};
