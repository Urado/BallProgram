// eslint.config.mjs

// Импорт необходимых плагинов
import eslintPluginReact from 'eslint-plugin-react'; // Поддержка React
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'; // Проверка правил хуков React
import eslintPluginImport from 'eslint-plugin-import'; // Управление импортами
import eslintPluginPrettier from 'eslint-plugin-prettier'; // Интеграция Prettier
import eslintPluginJsdoc from 'eslint-plugin-jsdoc'; // Проверка JSDoc комментариев
import eslintPluginTsdoc from 'eslint-plugin-tsdoc'; // Проверка TSDoc комментариев
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'; // Сортировка импортов
import parserTypeScript from '@typescript-eslint/parser'; // Парсер для TypeScript
import pluginTypeScript from '@typescript-eslint/eslint-plugin'; // Плагин для TypeScript

export default [
  {
    files: ['**/*.ts', '**/*.tsx'], // Применение правил к файлам с расширениями .ts и .tsx
    languageOptions: {
      parser: parserTypeScript, // Использование парсера для TypeScript
      parserOptions: {
        project: './tsconfig.json', // Путь к конфигурации TypeScript
        ecmaVersion: 'latest', // Использование последней версии ECMAScript
        sourceType: 'module', // Поддержка модульной системы
        ecmaFeatures: {
          jsx: true, // Поддержка JSX
        },
      },
    },
    plugins: {
      react: eslintPluginReact, // Плагин для React
      'react-hooks': eslintPluginReactHooks, // Плагин для хуков React
      import: eslintPluginImport, // Плагин для управления импортами
      prettier: eslintPluginPrettier, // Плагин для интеграции с Prettier
      jsdoc: eslintPluginJsdoc, // Плагин для проверки JSDoc
      tsdoc: eslintPluginTsdoc, // Плагин для проверки TSDoc
      'simple-import-sort': eslintPluginSimpleImportSort, // Плагин для сортировки импортов
      '@typescript-eslint': pluginTypeScript, // Плагин для TypeScript
    },
    settings: {
      react: {
        version: 'detect', // Автоматическое определение версии React
      },
    },
    rules: {
      // Интеграция с Prettier
      'prettier/prettier': ['error'],

      // Правила для React
      'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }], // Разрешение JSX только в .tsx файлах
      'react/prop-types': 'off', // Отключение проверки prop-types (используется TypeScript)
      'react/react-in-jsx-scope': 'off', // Не требуется импорт React в каждом файле
      'react/jsx-props-no-spreading': 'off', // Разрешение распространения пропсов
      'react/require-default-props': 'off', // Отключение обязательных defaultProps

      // Правила для хуков React
      'react-hooks/rules-of-hooks': 'error', // Проверка правильного использования хуков
      'react-hooks/exhaustive-deps': 'warn', // Проверка зависимостей в useEffect

      // Сортировка импортов
      'simple-import-sort/imports': 'error', // Сортировка импортов
      'simple-import-sort/exports': 'error', // Сортировка экспортов

      // Правила для TypeScript
      // '@typescript-eslint/explicit-function-return-type': [
      //   // Предупреждение при отсутствии явного типа возвращаемого значения
      //   'warn',
      //   {
      //     allowConciseArrowFunctionExpressionsStartingWithVoid: true, // Разрешает короткие стрелочные функции, возвращающие void,
      //     allowTypedFunctionExpressions: true,
      //     allowHigherOrderFunctions: true,
      //   },
      // ],
      '@typescript-eslint/no-explicit-any': 'warn', // Предупреждение при использовании типа any
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Предупреждение о неиспользуемых переменных, игнорируя те, что начинаются с _
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'], // Использование interface вместо type
      '@typescript-eslint/prefer-nullish-coalescing': 'error', // Предпочтение nullish coalescing оператору
      '@typescript-eslint/prefer-optional-chain': 'error', // Предпочтение optional chaining оператору

      // // Проверка JSDoc / TSDoc
      // 'jsdoc/require-jsdoc': [
      //   'warn',
      //   {
      //     require: {
      //       FunctionDeclaration: true,
      //       MethodDefinition: true,
      //       ClassDeclaration: true,
      //     },
      //   },
      // ],
      'tsdoc/syntax': 'warn', // Предупреждение при нарушении синтаксиса TSDoc
    },
  },
];