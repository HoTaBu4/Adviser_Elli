import pluginVue from 'eslint-plugin-vue'
export default [
  // add more generic rulesets here, such as:
  // js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // ...pluginVue.configs['flat/vue2-recommended'], // Use this if you are using Vue.js 2.x.
  {
    rules: {
      'vue/multi-word-component-names': 'off', // Disable multi-word component name rule
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never', // No self-closing for void elements like <img>
            normal: 'always', // Require self-closing for empty non-void elements
            component: 'always', // Require self-closing for Vue components
          },
        },
      ],
    },
  }
]