const _ = require("lodash");

let passwordUpdated = {
  status: true,
  message: "Your Password has been Updated!",
};
let userNotExist = {
  status: false,
  message: "The User doesn't exist!",
};
let sameAsOldPassword = {
  status: false,
  message: "New password should not be the same as the old password.",
};

module.exports = {
  // Change Password API
  async changePassword(ctx) {
    try {
      const { password, email, currentPassword } = ctx.request.body;

      if (currentPassword === password) {
        // Return a 400 Bad Request status and a message.
        return ctx.badRequest(sameAsOldPassword);
      }

      if (!password) {
        // Return a 400 Bad Request status and a message.
        return ctx.badRequest("New password is required.");
      }

      const user = await strapi.db
        .query("plugin::users-permissions.user")
        .findOne({
          where: { email },
        });

      if (!user) {
        // Return a 404 Not Found status or another appropriate status.
        return ctx.notFound("User not found.");
      }

      // Check if the old password is correct.
      const validOldPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(currentPassword, user.password);

      if (!validOldPassword) {
        // Return a 400 Bad Request status and a message for incorrect old password.
        return ctx.badRequest("The old password is not correct.");
      }

      // Check if the new password meets your criteria.
      const validNewPassword = await strapi.plugins[
        "users-permissions"
      ].services.user.validatePassword(password, user.password);

      if (validNewPassword) {
        // Return a 400 Bad Request status and a message for an invalid new password.
        return ctx.badRequest("The new password is invalid.");
      }

      // At this point, both old and new passwords are valid, so update the password here.
      // You should add code here to update the user's password in your database.

      // Return a success message with an appropriate status (e.g., 200 OK).
      await strapi.plugins["users-permissions"].services.user.edit(user.id, {
        password,
      });
      return ctx.send(passwordUpdated);
    } catch (error) {
      console.log("error", error);
      // Handle other errors appropriately.
    }
  },

  // Quotation Email API
  async getQuoteEmail() {
    const ctx = strapi.requestContext.get();

    const successMessage = (email) => ({
      status: true,
      message: "Email sent successfully.",
    });
    try {
      const {
        name,
        email,
        phone,
        productLine,
        price,
        interval,
        numOfStudents,
        packageName,
      } = ctx.request.body;

      if (
        name &&
        email &&
        phone &&
        productLine &&
        price &&
        interval &&
        numOfStudents
      ) {
        let emailBody = `
        <table style="font-family: arial, sans-serif;border-collapse: collapse;width: 100%;">
          <tr>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Name</th>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Email</th>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Phone Number</th>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Product Line</th>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Price</th>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Interval Type</th>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Number Of Students</th>
            <th style="border: 1px solid #dddddd;text-align: left; padding: 8px;">Package Name</th>            
          </tr>
          <tr>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px;">${name}</td>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px; background-color: #dddddd;">${email}</td>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px;">${phone}</td>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px; background-color: #dddddd;">${productLine}</td>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px;">${price}</td>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px; background-color: #dddddd;">${interval}</td>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px;">${numOfStudents}</td>
            <td style="border: 1px solid #dddddd;text-align: left; padding: 8px; background-color: #dddddd;">${
              packageName ?? "N/A"
            }</td>
          </tr>
        </table>
        `;
        await strapi.plugins["email"].services.email.send({
          to: email,
          from: process.env.FROM_ADDRESS,
          subject: "Get Quotation Information",
          // text: "Hello world",
          html: emailBody,
        });

        return ctx.send(successMessage(email));
      } else {
        return ctx.send({
          status: false,
          message: "Bad request",
        });
      }
    } catch (error) {

      return ctx.badRequest(error);
    }
  },
  // Newsletter Subscription API
  async newsletterSubscription() {
    const ctx = strapi.requestContext.get();

    const successMessage = (email) => ({
      status: true,
      message: "Thanks for subscribing to our newsletter.",
    });
    try {
      const { email } = ctx.request.body;

      if (email) {
        const checkEmail = await strapi.db
          .query("api::newsletter.newsletter")
          .findOne({
            where: { email },
          });
        if (!checkEmail) {
          let emailBody = `
          <p style="font-family: arial;"> Following email has been subscribed to your newsletter:</p>
          <a href="mailto:${email}" style="font-family: arial;">${email}</a>
        `;
          let respEmail = await strapi.plugins["email"].services.email.send({
            to: process.env.NEWSLETTER_ADMIN_EMAIL,
            // from: process.env.FROM_ADDRESS,
            from: process.env.FROM_ADDRESS,
            subject: "Newsletter Subscription Notification",
            // text: "Hello world",
            html: emailBody,
          });

          if (respEmail.accepted.length) {
            await strapi.entityService.create("api::newsletter.newsletter", {
              data: {
                email: email,
              },
            });
          }

          return ctx.send(successMessage(email));
        } else {
          return ctx.send({
            status: false,
            message: "This email is already in the newsletter list.",
          });
        }
      } else {
        return ctx.send({
          status: false,
          message: "Bad request",
        });
      }
    } catch (error) {

      return ctx.badRequest(error);
    }
  },

  // Email To Student For Payment
  async studentPaymentEmail() {
    const ctx = strapi.requestContext.get();

    const successMessage = (email) => ({
      status: true,
      message: "Email sent successfully.",
    });
    const { name, email, cartItems, studentID } = ctx.request.body;

    if (name && email) {
      try {
        let cartDataID;

        if (name && email) {
          const user = await strapi.db
            .query("plugin::users-permissions.user")
            .findOne({
              where: { email },
            });

          if (user) {
            const cartData = await strapi.entityService.create(
              "api::cart.cart",
              {
                data: {
                  itemsData: cartItems,
                  user: user,
                },
              }
            );

            cartDataID = cartData?.id;
            let linkURL = `https://genius-academy-47554.web.app/payment-steps?ordernumber=${cartDataID}`;

            let emailBody = `
                <p>Hi ${name}, This is your checkout URL: </p>
                <a href=${linkURL}>https://genius-academy-47554.web.app/payment-steps?ordernumber=${cartDataID}</a>
              `;

            await strapi.plugins["email"].services.email.send({
              to: email,
              from: process.env.FROM_ADDRESS,

              subject: "Checkout/Payment Process URL",
              html: emailBody,
            });
          }

          return ctx.send(successMessage(email));
        }
      } catch (error) {

        return ctx.badRequest(error);
      }
    } else {
      return ctx.send({
        status: false,
        message: "Bad request",
      });
    }
  },

  // Update User Role API
  async updateUserRole(ctx) {
    try {
      const { userID, role } = ctx.request.body;

      if (userID && role) {
        // Return a success message with an appropriate status (e.g., 200 OK).
        let updatedRole = await strapi.plugins[
          "users-permissions"
        ].services.user.edit(userID, {
          role,
        });

        return ctx.send({
          updatedRole,
          status: true,
          message: "Role has been updated successfully.",
        });
      }
    } catch (err) {
      return ctx.badRequest(err);
    }
  },
};
