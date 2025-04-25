const asyncHandler = (requrestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requrestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};

export { asyncHandler };
