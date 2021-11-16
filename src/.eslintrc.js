module.exports = {
  extends: [
    "react-app",
    "eslint:recommended",
    //"plugin:promise/recommended"
  ],
  plugins: ["promise"],
  rules: {
    //"promise/catch-or-return": "error",
    //"promise/always-return": "error",
    "no-unused-vars": "off",
    "react-hooks/exhaustive-deps": "off",
    "@typescript-eslint/no-unused-vars": "off"
  },
  "globals": {
    "NodeJS": true
  },
};
