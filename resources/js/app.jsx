import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Aquí se aplica la corrección:
        // El Toaster se renderiza fuera del componente principal de la página,
        // usando un fragmento (<>...</>), lo que lo hace persistente
        // a través de las navegaciones de Inertia.
        root.render(
            <>


                <BrowserRouter>
                    <Toaster /> {/* <-- ¡Añade esto! */}
                    <App {...props} />
                </BrowserRouter>
            </>
        );
    },
    progress: {
        color: '#4B5563',
    },
});