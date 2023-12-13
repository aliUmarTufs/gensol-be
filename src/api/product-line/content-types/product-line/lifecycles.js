const { ApplicationError, ValidationError } = require("@strapi/utils").errors;

module.exports = {
  async beforeCreate(event) {
    console.log({ ...event.params.data });
    if (!event.params.data?.packages?.connect?.length) {
      throw new ApplicationError("Please Select a package");
    }
  },
  async afterUpdate(event) {
    console.log({ ...event.params.data });
    const getPLDetail = await strapi.entityService.findOne(
      "api::product-line.product-line",
      event?.params?.data?.id,
      {
        populate: ["packages"],
      }
    );

    console.log({ getPLDetail });

    if (!getPLDetail.packages?.length) {
      throw new ApplicationError("Please Select a package");
    }
  },
};
