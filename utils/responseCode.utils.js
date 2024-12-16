module.exports = {
    successResponse: (res, message, data = {}) => {
      return res.status(200).json({ success: true, message, data });
    },
  
    createdResponse: (res, message, data = {}) => {
      return res.status(201).json({ success: true, message, data });
    },
  
    errorResponse: (res, message, code = 400) => {
      return res.status(code).json({ success: false, message });
    },
  
    unauthorizedResponse: (res, message) => {
      return res.status(401).json({ success: false, message });
    },
  
    serverErrorResponse: (res, message) => {
      return res.status(500).json({ success: false, message });
    },
  };
  