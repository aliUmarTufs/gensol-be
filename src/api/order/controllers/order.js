"use strict";

/**
 * order controller
 */

// const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::order.order");

// @ts-ignore
const stripe = require("stripe")(
  process.env.STRAPI_ADMIN_TEST_STRIPE_SECRET_KEY
);

const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You are not authorized!");
    }

    const { amount, orderItems, token, moreDetails } = ctx.request.body.data;

    // Create an array to store the product names for each order item
    const productNames = [];

    // Check if only one of package or course is selected in each order item
    for (const orderItem of orderItems) {
      if (orderItem.course && orderItem.package) {
        ctx.response.status = 400;
        return {
          error: {
            message:
              "Only one of package or course can be selected at a time in each order item.",
          },
          amount,
          orderItems,
          token,
          user: ctx.state.user,
          moreDetails,
        };
      }

      let productName = "";
      if (orderItem.course) {
        const course = await strapi.entityService.findOne(
          "api::course.course",
          orderItem.course
        );
        productName = course.title;
      } else if (orderItem.package) {
        const packageItem = await strapi.entityService.findOne(
          "api::package.package",
          orderItem.package
        );
        productName = packageItem.title;
      }
      productNames.push(productName);
    }

    // Check if at least one package or course is selected
    const hasPackage = orderItems.some(
      (orderItem) => orderItem.package !== null
    );
    const hasCourse = orderItems.some((orderItem) => orderItem.course !== null);

    if (!hasPackage && !hasCourse) {
      ctx.response.status = 400;
      return {
        error: {
          message:
            "At least one of package or course must be selected in each order item.",
        },
        amount,
        orderItems,
        token,
        user: ctx.state.user,
        moreDetails,
      };
    }

    // The rest of your code remains unchanged
    const amountInInt = amount * 100;
    // Get the customer's unique identifier
    const customerIdentifier = user.email;

    // Check if the customer already exists
    const customer = await stripe.customers.list({
      email: customerIdentifier,
    });

    if (customer.data.length === 0) {
      await stripe.customers.create({
        email: customerIdentifier,
        name: user.name,
      });
    }

    try {
      await stripe.charges.create({
        amount: amountInInt,
        currency: "usd",
        description: `Order ${new Date()} by ${ctx.state.user.id}`,
        source: token,
        customer: customer.id,
        metadata: {
          productNames: productNames.join(", "),
        },
      });

      const order = await strapi.service("api::order.order").create({
        data: {
          amount,
          orderItems,
          token,
          user: ctx.state.user.id,
          moreDetails,
        },
      });

      return { order, message: "Order created successfully." };
    } catch (err) {
      ctx.response.status = 500;
      return {
        error: { message: "There was a problem creating the charge" },
        amount,
        orderItems,
        token,
        user: ctx.state.user,
        moreDetails,
      };
    }
  },
}));
