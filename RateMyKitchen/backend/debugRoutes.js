const app = require('./src/app');

function printRoutes(stack, prefix = '') {
    stack.forEach(layer => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
            console.log(`${methods.padEnd(7)} ${prefix}${layer.route.path}`);
        } else if (layer.name === 'router' && layer.handle.stack) {
            // Extract the path from the regex (not perfect but works for simple cases)
            let pathPart = layer.regexp.source
                .replace('^\\', '')
                .replace('\\/?(?=\\/|$)', '')
                .replace(/\\\//g, '/')
                .replace('(?:\\/(?=$))?$', '');

            // Handle the case where the regex is like ^\/api\/admin\/?(?=\/|$)
            if (pathPart.startsWith('/')) {
                // It's clean enough
            } else {
                pathPart = '/' + pathPart;
            }

            // Clean up common regex artifacts manually if needed
            pathPart = pathPart.replace('^', '').replace('(?=\\/|$)', '');

            printRoutes(layer.handle.stack, prefix + pathPart);
        }
    });
}

console.log('--- Registered Routes ---');
try {
    printRoutes(app._router.stack);
} catch (e) {
    console.error(e);
}
console.log('-------------------------');
