// const { CoursesHandler } = require("./Helpers/CoursesHandler");

// module.exports = async () => {
//   //remove member with id 0JABI from array of members in all courses
//   await MongoDB.db("Courses")
//     .collection("courses")
//     .updateMany(
//       {},
//       {
//         $pull: {
//           members: "0JABI"
//         },
//       }
//     );

//   //get all users from database
//   let users = await MongoDB.db("UserData").collection("users").find().toArray();
//   users = users.filter(
//     (user) => user.email.includes("@tet.moe") && user.username !== "teto"
//   );
//   //delete users
//   for (let user of users) {
//     await MongoDB.db("UserData").collection("users").deleteOne({
//       _id: user._id,
//     });
//   }
// };
