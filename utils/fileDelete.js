const fs = require("fs/promises");

const fileDeleteHandler = async (filePath) => {
  if (!filePath || filePath === "") {
    console.error("Invalid file path provided.");
    return false; // Return false if the file path is invalid
  }

//   console.log(`Attempting to delete file at path: ${filePath}`);

  try {
    // Try deleting the file
    await fs.unlink(filePath);
    // console.log(`File at path ${filePath} deleted successfully.`);
    return true;
  } catch (err) {
    // Log the error for better debugging
    console.error(`Error deleting file at ${filePath}:`, err.message);
    return false; // Return false if there's an error during deletion
  }
};

module.exports = fileDeleteHandler;
