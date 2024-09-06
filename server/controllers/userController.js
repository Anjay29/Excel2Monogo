import UserData from "../models/userData.js";

const addNewUser = async (req, res) => {
    try {
        const {
            Name,
            Email,
            Mobile_Number,
            Date_of_Birth,
            Work_Experience,
            Resume_Title,
            Current_Location,
            Postal_Address,
            Current_Employer,
            Current_Designation
        } = req.body;
        
        
        const existedUser = await UserData.findOne({
            $and: [{Email},{Name},{Mobile_Number},{Date_of_Birth},{Work_Experience},{Resume_Title},{Current_Designation},{Postal_Address},{Current_Employer},{Current_Location}]
        });
        
        if (existedUser) {
            return res.status(200).json({ message: "User already exists" });
        }
        
        const existedEmail = await UserData.findOne({
            Email
        });
        
        if(existedEmail){
            return res.status(200).json({ message: "Email Id already existed" });
        }
        
        // Create a new user in the database
        await UserData.create([{
            Name,
            Email,
            Mobile_Number,
            Date_of_Birth,
            Work_Experience,
            Resume_Title,
            Current_Location,
            Postal_Address,
            Current_Employer,
            Current_Designation
        }]);

        res.status(200).json({ message: "User information processed successfully" });
    } catch (error) {
        console.error("Error in addNewUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default addNewUser;