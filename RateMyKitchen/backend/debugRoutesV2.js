const app = require('./src/app');

console.log('App loaded:', typeof app);
if (app._router) {
    console.log('Router found');
    app._router.stack.forEach(function (r) {
        if (r.route && r.route.path) {
            console.log(r.route.path)
        }
        if (r.name === 'router') {
            const regexp = r.regexp.toString();
            console.log('Router Middleware: ' + regexp);
            if (r.handle.stack) {
                r.handle.stack.forEach(function (handler) {
                    if (handler.route) {
                        const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
                        console.log('  ' + methods + ' ' + handler.route.path);
                    }
                });
            }
        }
    })
} else {
    console.log('app._router is undefined. App keys:', Object.keys(app));
}
