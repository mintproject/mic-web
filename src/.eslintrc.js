module.exports = {
  extends: [
    "react-app",
    "eslint:recommended",
    "plugin:promise/recommended"
  ],
  plugins: ["promise"],
  rules: {
    "promise/catch-or-return": "error",
    "promise/always-return": "error",
    "no-unused-vars": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  },
  "globals": {
    "NodeJS": true
  },
};
