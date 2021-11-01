module.exports = {
  extends: [
    "react-app",
    "eslint:recommended"
    //"plugin:promise/recommended"
  ],
  plugins: ["promise"],
  rules: {
    "promise/catch-or-return": "error",
    "promise/always-return": "error",
    "semi": "off",
    "@typescript-eslint/semi": "error"
  },
};
