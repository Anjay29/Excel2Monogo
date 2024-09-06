import mongoose from 'mongoose';

const userData = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Mobile_Number: { type: String, required: true },
    Date_of_Birth: { type: String, required: true },
    Work_Experience: { type: String, required: true },
    Resume_Title: { type: String, required: true },
    Current_Location: { type: String, required: true },
    Postal_Address: { type: String, required: true },
    Current_Employer: { type: String},
    Current_Designation: { type: String}
  },
  {
    timestamps: true,
  }
);

const UserData = mongoose.model('UserData', userData);
export default UserData;