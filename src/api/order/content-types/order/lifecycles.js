// const { ApplicationError, ValidationError } = require("@strapi/utils").errors;

// module.exports = {
//   async afterCreate(event) {
//     console.log({ ...event.params.data });

//     const { orderItems } = event.params.data;

//     const hasNeitherPackageNorCourse = orderItems.some((orderItem) => {
//       console.log(orderItem.field);

//       return !orderItem.package && !orderItem.course;
//     });
//     console.log({ hasNeitherPackageNorCourse });
//     return;
//     // Check if neither package nor course is selected
//     // if (!package?.connect?.length && !package?.connect?.length) {
//     //   throw new ApplicationError("You must select either package or course");
//     // }
//     // // Check if both package and course are selected
//     // if (package?.connect?.length && course?.connect?.length) {
//     //   throw new ApplicationError(
//     //     "You can only select one of package or course"
//     //   );
//     // }
//   },
// };
