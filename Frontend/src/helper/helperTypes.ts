export type propType = {
  type: string;
};
export type propTypeTwo = {
  id: string;
};

// export type uploadDataType = {
//   // message: string;
//   data: string[];
// };

export type pdfNameDataType = {
  message: String;
  data: String[];
};

// {
//   "message": "PDF names retrieved successfully",
//   "data": [
//     "user12345_merged_1633687423764.pdf",
//     "user12345_merged_1633687423765.pdf"
//   ]
// }

// for use of accessing properties of "user" object
export type userDataType = {
  _id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
};
