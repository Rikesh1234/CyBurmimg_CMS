// helper/pagination.js
const paginate = async (model, page = 1, limit = 10) => {
    // Parse page and limit values to ensure they are numbers
    page = parseInt(page);
    limit = parseInt(limit);
  
    // Count the total number of documents in the collection
    const totalDocuments = await model.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
  
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
  
    // Fetch paginated data
    const data = await model.find().skip(skip).limit(limit);
  
    // Return paginated results and metadata
    return {
      data,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  };
  
  module.exports = paginate;
  