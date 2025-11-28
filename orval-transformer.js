// orval-transformer.js  (in project root)
module.exports = function transformer(operation) {
  // Safe access — check if response exists first
  if (!operation.response) {
    return operation;  // Skip if no response schema
  }
  return {
    ...operation,
    response: {
      success: operation.response.success?.schema || 'any',  // Fallback to 'any'
      error: operation.response.error?.schema || 'any',
    },
  };
};