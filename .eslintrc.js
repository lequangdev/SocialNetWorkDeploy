module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
    ],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      // Bạn có thể thêm hoặc ghi đè các quy tắc ESLint tại đây
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': 'off', // Tắt cảnh báo về các biến không sử dụng
    },
  };