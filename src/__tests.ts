declare var require: any;
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().map(context);
