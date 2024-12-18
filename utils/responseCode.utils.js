export const successResponse = (res, message, data = {}) => {
  return res.status(200).json({ success: true, message, data });
};

export const createdResponse = (res, message, data = {}) => {
  return res.status(201).json({ success: true, message, data });
};

export const errorResponse = (res, message, code = 400) => {
  return res.status(code).json({ success: false, message });
};

export const unauthorizedResponse = (res, message) => {
  return res.status(401).json({ success: false, message });
};

export const serverErrorResponse = (res, message) => {
  return res.status(500).json({ success: false, message });
};