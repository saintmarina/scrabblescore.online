module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
      "jsx-a11y/label-has-associated-control": "off",
      "jsx-a11y/label-has-for": "off",
      "jsx-a11y/interactive-supports-focus": "off",
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/require-default-props": "off",
      "react/prop-types": "off",
      "react/no-array-index-key": "off",
      "class-methods-use-this": ["error", { "exceptMethods": ["renderPassed", "activePlayerClass"] }],
      "no-plusplus": "off",
      "no-underscore-dangle": "off",
    }
};