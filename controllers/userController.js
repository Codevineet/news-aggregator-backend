import User from "../models/User.js";
export const addInterest = async (req, res) => {
  try {
    const { userId, interest } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.interests.includes(interest)) {
      user.interests.push(interest);
      await user.save();
    }
    res.json({ message: "Interest added" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const removeInterest = async (req, res) => {
  try {
    const { userId, interest } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.interests = user.interests.filter((i) => i !== interest);
    await user.save();
    res.json({ message: "Interest removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
