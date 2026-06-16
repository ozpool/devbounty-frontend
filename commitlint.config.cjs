module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      2,
      "always",
      [
        "wallet",
        "escrow",
        "auth",
        "security",
        "home",
        "board",
        "detail",
        "dashboard",
        "me",
        "wizard",
        "ui",
        "layout",
        "repo",
        "build",
        "ci",
        "deps",
      ],
    ],
  },
};
