import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import 'ts-helpers';

interface IPolyFillErrorConstructor extends ErrorConstructor {
  stackTraceLimit: any;
}

/* tslint:disable: no-undefined */
if (!ENV) {
  var ENV = 'development';
}

if (ENV === 'production') {
  // Production
} else {
  // Development

  (<IPolyFillErrorConstructor>Error).stackTraceLimit = Infinity;
  // require('zone.js/dist/long-stack-trace-zone');
}
/* tslint:enable */
