export default {
  isValidPath: path => {
    if (path.length > 0 && path[0] === "/" && path[path.length - 1] === "/") {
      return true;
    }
    return false;
  }
};
