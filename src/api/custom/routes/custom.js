module.exports = {
  routes: [
    {
      path: "/changePassword",
      handler: "custom.changePassword",
      method: "POST",
    },
    {
      path: "/getQuoteEmail",
      handler: "custom.getQuoteEmail",
      method: "POST",
    },
    {
      path: "/studentPaymentEmail",
      handler: "custom.studentPaymentEmail",
      method: "POST",
    },
    {
      path: "/updateUserRole",
      handler: "custom.updateUserRole",
      method: "POST",
    },
    {
      path: "/newsletterSubscription",
      handler: "custom.newsletterSubscription",
      method: "POST",
    },
  ],
};
