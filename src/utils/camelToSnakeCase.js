function camelToSnakeCase(str) {
  return str.replace(/[A-Z]/g, function (match) {
    return '_' + match.toLowerCase();
  });
}

export default camelToSnakeCase;
