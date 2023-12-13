// const { ApplicationError, ValidationError } = require("@strapi/utils").errors;
// if(){

// }
// // throw new ApplicationError("Slug cannot accept whitespaces.");
module.exports = {
  async beforeUpdate(event) {
    console.log({ ...event.params.data });
    if (
      event.params.data?.perStudentMonthlyPrice &&
      event.params.data?.numberOfStudents
    ) {
      event.params.data = {
        ...event.params.data,
        monthly:
          event.params.data?.perStudentMonthlyPrice *
          event.params.data?.numberOfStudents,
        yearly:
          event.params.data?.perStudentMonthlyPrice *
          event.params.data?.numberOfStudents *
          12,
      };
    }
  },
  async beforeCreate(event) {
    if (
      event.params.data?.perStudentMonthlyPrice &&
      event.params.data?.numberOfStudents
    ) {
      event.params.data = {
        ...event.params.data,
        monthly:
          event.params.data?.perStudentMonthlyPrice *
          event.params.data?.numberOfStudents,
        yearly:
          event.params.data?.perStudentMonthlyPrice *
          event.params.data?.numberOfStudents *
          12,
      };
    }
  },
};
