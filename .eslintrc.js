module.exports = {
    root: true,
    env: {
        browser: true
    },
    extends: [
        "eslint:recommended",
        "plugin:vue/vue3-essential"
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    plugins: [
        "vue"
    ],
    rules: {
        'generator-star-spacing': 'off',
        'vue/multi-word-component-names': 'off',
        'space-before-function-paren': 0,
        'standard/computed-property-even-spacing': 0,
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    },
    overrides: [
        {
            files: ['*.js', '*.vue'],
        },
    ],
}
