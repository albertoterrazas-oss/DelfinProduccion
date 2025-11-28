import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Motivos from './Catalogos/Motivos';

export default function Home({ auth }) {

    // 1. Estado local para la información del usuario
    const [usuario, setUsuario] = useState(auth.user || null);

    useEffect(() => {
        // ✅ ESCENARIO 1: USUARIO AUTENTICADO
        if (auth && auth.user) {
            // Sincronizar el estado local si la prop 'auth.user' cambia.
            if (usuario !== auth.user) {
                console.log("Usuario detectado en auth, actualizando estado local:", auth.user);
                setUsuario(auth.user);
            }
        }
        else {
            console.warn("Usuario no detectado en auth. Iniciando logout/redirección forzada.");
        
            setUsuario(null);
            console.log("Redirigiendo a /login (vía Inertia).");
        }

    }, [auth, usuario]); // Dependencia eliminada: 'navigate' no existe, 'router' es estable.

    return (
    <>
        {usuario && (
            <AuthenticatedLayout
                // Pasamos el estado local 'usuario' al Layout
                user={usuario} 
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
            >
                <Head title="Dashboard" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                {/* Muestra el saludo si el usuario existe */}
                                ¡Hola, {usuario.name}! 
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        )}
        
        {/* Muestra un indicador de carga o mensaje solo si el usuario NO existe */}
        {!usuario && (
            
              <Motivos/>
        )}
    </>
);
}