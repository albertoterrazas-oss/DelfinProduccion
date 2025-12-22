// // import { useEffect, useState } from "react";
// // import request from "@/utils";
// // import {
// //     Truck,
// //     User,
// //     Plus,
// //     ArrowRight,
// //     ClipboardList,
// //     FileText,
// //     Clock,
// //     ArrowUpRight,
// //     ArrowDownLeft,
// // } from 'lucide-react';

// // import Datatable from "@/Components/Datatable";
// // import { Link } from 'react-router-dom'

// // const quickActions = [
// //     { name: 'Nueva Unidad', icon: Truck, url: 'unidades' },
// //     { name: 'Nuevo Chofer', icon: User, url: 'usuarios' },
// //     { name: 'Registrar Movimiento', icon: Clock, url: 'registrosalida' },
// //     { name: 'Nuevo Motivo', icon: ClipboardList, url: 'motivos' },
// //     { name: 'Generar Reporte', icon: FileText, url: 'reportes' },
// //     { name: 'Nuevo Destino', icon: Plus, url: 'destino' },
// // ];

// // function StatCard({ name, value, color = 'text-gray-900', icon: Icon }) {
// //     return (
// //         <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between transition transform hover:scale-[1.01] duration-300 ease-in-out">
// //             <div>
// //                 <p className="text-sm font-medium text-gray-500">{name}</p>
// //                 <p className={`mt-1 text-4xl font-extrabold ${color}`}>{value}</p>
// //             </div>
// //             {/* Icono con color tenue y un círculo de fondo para contraste */}
// //             <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10`}>
// //                 {Icon && <Icon className={`w-8 h-8 ${color}`} />}
// //             </div>
// //         </div>
// //     );
// // }

// // function QuickActionButton({ name, icon: Icon, action, ArrowRight, url }) {
// //     const toPath = `/${url.toLowerCase().replace(/\s+/g, '-')}`;

// //     return (
// //         <Link to={toPath} className="w-full">
// //             <button
// //                 onClick={action}
// //                 className="flex items-center p-4 bg-white rounded-xl shadow-md border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg transition duration-200 ease-in-out w-full transform hover:translate-y-[-2px] focus:outline-none focus:ring-4 focus:ring-blue-300/50"
// //             >
// //                 <span className="flex items-center space-x-4 flex-grow text-sm font-semibold text-gray-700">
// //                     <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
// //                     <span className="text-left">{name}</span>
// //                 </span>
// //                 {ArrowRight && <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />}
// //             </button>
// //         </Link>
// //     );
// // }

// // function QuickActions() {
// //     return (
// //         <div className="flex flex-col p-4 rounded-2xl bg-white shadow-xl border border-gray-100">
// //             <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Acciones Rápidas</h2>
// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
// //                 {quickActions.map((action, index) => (
// //                     <QuickActionButton key={index} {...action} />
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // }

// // export default function Dashboard() {

// //     const [dashboardData, setDashboardData] = useState({
// //         ultimas5Unidades: [],
// //         totalUnidades: 0,
// //         movimientosDeHoy: [],
// //         totalMovimientosHoy: 0,
// //         incidencias: [],
// //         totalIncidencias: 0,
// //     });

// //     const userObject = JSON.parse(localStorage.getItem('user'));


// //     const getUnits = async () => {
// //             console.log('Usuario en Dashboard:', userObject);
// //             // console.log('Obteniendo datos del dashboard...');

// //         try {
// //             const response = await fetch(route("DashboardUnidad"));
// //             if (!response.ok) {
// //                 throw new Error(`Error en la solicitud: ${response.statusText} (${response.status})`);
// //             }
// //             const data = await response.json();
// //             // ⭐️ ¡Aquí se guardan los datos en el estado! ⭐️
// //             setDashboardData(data);

// //         } catch (error) {
// //             console.error('Error al obtener las unidades:', error);
// //         } finally {
// //             // setIsLoading(false);
// //         }
// //     };

// //     const stats = [
// //         { name: 'Unidades en Patio', value: dashboardData.totalUnidades, icon: Truck, color: 'text-blue-600' },
// //         { name: 'Movimientos Hoy', value: dashboardData.totalMovimientosHoy, icon: Clock, color: 'text-yellow-600' },
// //         { name: 'Alertas Críticas', value: dashboardData.totalIncidencias, icon: ClipboardList, color: 'text-red-500' },
// //     ]

// //     useEffect(() => {
// //         getUnits() // Llamar a getUnits al montar
// //     }, [])

// //     return (
// //         <div className="flex flex-col gap-4 pb-4">
// //             <header className="mt-2">
// //                 <h1 className="text-3xl font-extrabold text-gray-900">Dashboard</h1>
// //                 <p className="text-gray-500 mt-1">
// //                     Resumen operativo y movimientos en tiempo real.
// //                 </p>
// //             </header>

// //             {/* Stats Section */}
// //             <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 ">
// //                 {stats.map((stat) => (
// //                     <StatCard key={stat.name} {...stat} />
// //                 ))}
// //             </div>

// //             {/* Main Content Area: Table and Quick Actions */}
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
// //                 {/* Table (takes 2/3 width on large screens) */}
// //                 <div className="lg:col-span-2">
// //                     <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
// //                         <h2 className="text-xl font-bold text-gray-800 border-b ">Últimas Unidades Registradas</h2>
// //                         <div className="overflow-x-auto">
// //                             <Datatable
// //                                 data={dashboardData.ultimas5Unidades}
// //                                 virtual={true}
// //                                 searcher={false}
// //                                 columns={[
// //                                     {
// //                                         header: "Estatus",
// //                                         accessor: "Unidades_estatus",
// //                                         width: '20%',
// //                                         cell: ({ item: { Unidades_estatus } }) => {
// //                                             const color = String(Unidades_estatus) === "1"
// //                                                 ? "bg-green-300" // Si es "1"
// //                                                 : "bg-red-300";  // Si NO es "1" (incluyendo "2", "0", null, etc.)

// //                                             return (
// //                                                 <span className={`inline-flex items-center justify-center rounded-full ${color} w-4 h-4`} />
// //                                             );
// //                                         },
// //                                     },
// //                                     { header: 'No. Económico', accessor: 'Unidades_numeroEconomico' },
// //                                     { header: 'Modelo', accessor: 'Unidades_modelo' },
// //                                     { header: 'Placa', accessor: 'Unidades_placa' },
// //                                     { header: 'Mantenimiento', accessor: 'Unidades_mantenimiento' },
// //                                 ]}
// //                             />
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* Quick Actions (takes 1/3 width on large screens) */}
// //                 <div className="lg:col-span-1">
// //                     <QuickActions />
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// import { useEffect, useState } from "react";
// import {
//     Truck,
//     User,
//     Plus,
//     ArrowRight,
//     ClipboardList,
//     FileText,
//     Clock,
//     LayoutDashboard,
//     LogOut
// } from 'lucide-react';

// import Datatable from "@/Components/Datatable";
// import { Link } from 'react-router-dom';

// // --- CONFIGURACIÓN DE ACCIONES ---
// const quickActions = [
//     { name: 'Nueva Unidad', icon: Truck, url: 'unidades' },
//     { name: 'Nuevo Chofer', icon: User, url: 'usuarios' },
//     { name: 'Registrar Movimiento', icon: Clock, url: 'registrosalida' },
//     { name: 'Nuevo Motivo', icon: ClipboardList, url: 'motivos' },
//     { name: 'Generar Reporte', icon: FileText, url: 'reportes' },
//     { name: 'Nuevo Destino', icon: Plus, url: 'destino' },
// ];

// // --- SUB-COMPONENTES ---

// function StatCard({ name, value, color = 'text-gray-900', icon: Icon }) {
//     return (
//         <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between transition transform hover:scale-[1.01] duration-300 ease-in-out">
//             <div>
//                 <p className="text-sm font-medium text-gray-500">{name}</p>
//                 <p className={`mt-1 text-4xl font-extrabold ${color}`}>{value}</p>
//             </div>
//             <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10`}>
//                 {Icon && <Icon className={`w-8 h-8 ${color}`} />}
//             </div>
//         </div>
//     );
// }

// function QuickActionButton({ name, icon: Icon, url }) {
//     const toPath = `/${url.toLowerCase().replace(/\s+/g, '-')}`;
//     return (
//         <Link to={toPath} className="w-full">
//             <button className="flex items-center p-4 bg-white rounded-xl shadow-md border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg transition duration-200 ease-in-out w-full transform hover:translate-y-[-2px] focus:outline-none focus:ring-4 focus:ring-blue-300/50">
//                 <span className="flex items-center space-x-4 flex-grow text-sm font-semibold text-gray-700">
//                     <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
//                     <span className="text-left">{name}</span>
//                 </span>
//                 <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
//             </button>
//         </Link>
//     );
// }

// function QuickActions() {
//     return (
//         <div className="flex flex-col p-4 rounded-2xl bg-white shadow-xl border border-gray-100">
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Acciones Rápidas</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
//                 {quickActions.map((action, index) => (
//                     <QuickActionButton key={index} {...action} />
//                 ))}
//             </div>
//         </div>
//     );
// }

// // NUEVO: Componente de Bienvenida para no-admins
// function WelcomeView({ user }) {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center mt-6">
//             <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-5 rounded-full mb-6 shadow-lg shadow-blue-200">
//                 <User className="w-12 h-12 text-white" />
//             </div>
//             <h1 className="text-4xl font-black text-gray-900 mb-2">
//                 ¡Qué bueno verte, {user?.Personas_nombres || 'Usuario'} {user?.Personas_apPaterno || 'Usuario'} {user?.Personas_apMaterno || 'Usuario'}!
//             </h1>
//             <p className="text-gray-500 text-lg max-w-lg">
//                 Has ingresado al panel de control. Actualmente tu perfil está configurado como
//                 <span className="font-bold text-blue-600"> Personal Operativo</span>.
//             </p>

//             <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
//                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
//                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tu Puesto</p>
//                     <p className="text-gray-800 font-semibold">{user?.Personas_puesto === "2002" ? "Operador Logístico" : "Colaborador"}</p>
//                 </div>
//                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
//                     <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Licencia</p>
//                     <p className="text-gray-800 font-semibold">{user?.Personas_licencia || 'N/A'}</p>
//                 </div>
//             </div>

//             {/* <div className="mt-8 flex gap-4">
//                 <Link to="/perfil" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2">
//                     Ver mi perfil
//                 </Link>
//             </div> */}
//         </div>
//     );
// }

// // --- COMPONENTE PRINCIPAL ---

// export default function Dashboard() {
//     const [dashboardData, setDashboardData] = useState({
//         ultimas5Unidades: [],
//         totalUnidades: 0,
//         totalMovimientosHoy: 0,
//         totalIncidencias: 0,
//     });

//     // Obtener datos del usuario del localStorage
//     const userObject = JSON.parse(localStorage.getItem('user'));
//     const [positions, setPositions] = useState([]); // Lista de puestos

//     // Verificación de ROL (Admin = "1")
//     const isAdmin = userObject?.usuario_idRol === "2";

//     const getDashboardInfo = async () => {
//         // Solo llamar a la API si es Administrador
//         if (!isAdmin) return;

//         try {
//             const response = await fetch(route("DashboardUnidad"));
//             if (!response.ok) throw new Error(`Error: ${response.statusText}`);
//             const data = await response.json();
//             setDashboardData(data);
//         } catch (error) {
//             console.error('Error al obtener datos del dashboard:', error);
//         }
//     };

//     const getPositions = async () => {
//         try {
//             // setIsLoading(true);
//             const data = await fetch(route("puestos.index")).then(res => res.json());
//             setPositions(data);
//             // setIsLoading(false);

//         } catch (error) {
//             console.error('Error al obtener los puestos:', error);
//             // setIsLoading(false);
//             toast.error("Error al cargar la lista de puestos.");
//         }
//     }


//     useEffect(() => {
//         getDashboardInfo();
//         getPositions();
//     }, []);

//     return (
//         <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
//             {/* Header Dinámico */}
//             <header className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                 <div>
//                     <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
//                         {isAdmin ? <LayoutDashboard className="text-blue-600" /> : null}
//                         {isAdmin ? "Panel de Control" : "Inicio"}
//                     </h1>
//                     <p className="text-gray-500 font-medium">
//                         {isAdmin
//                             ? "Supervisión general de flota y movimientos."
//                             : `Bienvenido de nuevo al sistema de logística.`}
//                     </p>
//                 </div>
//                 {!isAdmin && (
//                     <div className="text-right">
//                         <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">
//                             Sesión Activa
//                         </span>
//                     </div>
//                 )}
//             </header>

//             {isAdmin ? (
//                 /* VISTA PARA ADMINISTRADORES */
//                 <>
//                     {/* Stats Section */}
//                     <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                         <StatCard
//                             name="Unidades en Patio"
//                             value={dashboardData.totalUnidades}
//                             icon={Truck}
//                             color="text-blue-600"
//                         />
//                         <StatCard
//                             name="Movimientos Hoy"
//                             value={dashboardData.totalMovimientosHoy}
//                             icon={Clock}
//                             color="text-yellow-600"
//                         />
//                         <StatCard
//                             name="Alertas Críticas"
//                             value={dashboardData.totalIncidencias}
//                             icon={ClipboardList}
//                             color="text-red-500"
//                         />
//                     </div>

//                     {/* Main Content Area */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                         {/* Tabla */}
//                         <div className="lg:col-span-2">
//                             <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full">
//                                 <div className="flex items-center justify-between mb-6 border-b pb-4">
//                                     <h2 className="text-xl font-bold text-gray-800">Últimas Unidades</h2>
//                                     <Link to="/unidades" className="text-blue-600 text-sm font-bold hover:underline">Ver todas</Link>
//                                 </div>
//                                 <div className="overflow-x-auto">
//                                     <Datatable
//                                         data={dashboardData.ultimas5Unidades}
//                                         virtual={true}
//                                         searcher={false}
//                                         columns={[
//                                             {
//                                                 header: "Estatus",
//                                                 accessor: "Unidades_estatus",
//                                                 width: '10%',
//                                                 cell: ({ item: { Unidades_estatus } }) => (
//                                                     <span className={`inline-flex items-center justify-center rounded-full ${String(Unidades_estatus) === "1" ? "bg-green-400 shadow-sm shadow-green-200" : "bg-red-400 shadow-sm shadow-red-200"} w-3 h-3`} />
//                                                 ),
//                                             },
//                                             { header: 'No. Económico', accessor: 'Unidades_numeroEconomico' },
//                                             { header: 'Modelo', accessor: 'Unidades_modelo' },
//                                             { header: 'Placa', accessor: 'Unidades_placa' },
//                                             { header: 'Mantenimiento', accessor: 'Unidades_mantenimiento' },
//                                         ]}
//                                     />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Acciones Rápidas */}
//                         <div className="lg:col-span-1">
//                             <QuickActions />
//                         </div>
//                     </div>
//                 </>
//             ) : (
//                 /* VISTA PARA USUARIOS OPERATIVOS */
//                 <WelcomeView user={userObject} />
//             )}
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import {
    Truck,
    User,
    Plus,
    ArrowRight,
    ClipboardList,
    FileText,
    Clock,
    LayoutDashboard,
} from 'lucide-react';

import Datatable from "@/Components/Datatable";
import { Link } from 'react-router-dom';

// --- CONFIGURACIÓN DE ACCIONES ---
const quickActions = [
    { name: 'Nueva Unidad', icon: Truck, url: 'unidades' },
    { name: 'Nuevo Chofer', icon: User, url: 'usuarios' },
    { name: 'Registrar Movimiento', icon: Clock, url: 'registrosalida' },
    { name: 'Nuevo Motivo', icon: ClipboardList, url: 'motivos' },
    { name: 'Generar Reporte', icon: FileText, url: 'reportes' },
    { name: 'Nuevo Destino', icon: Plus, url: 'destino' },
];

// --- SUB-COMPONENTES ---

function StatCard({ name, value, color = 'text-gray-900', icon: Icon }) {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between transition transform hover:scale-[1.01] duration-300 ease-in-out">
            <div>
                <p className="text-sm font-medium text-gray-500">{name}</p>
                <p className={`mt-1 text-4xl font-extrabold ${color}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10`}>
                {Icon && <Icon className={`w-8 h-8 ${color}`} />}
            </div>
        </div>
    );
}

function QuickActionButton({ name, icon: Icon, url }) {
    const toPath = `/${url.toLowerCase().replace(/\s+/g, '-')}`;
    return (
        <Link to={toPath} className="w-full">
            <button className="flex items-center p-4 bg-white rounded-xl shadow-md border-2 border-gray-100 hover:border-blue-400 hover:shadow-lg transition duration-200 ease-in-out w-full transform hover:translate-y-[-2px] focus:outline-none focus:ring-4 focus:ring-blue-300/50">
                <span className="flex items-center space-x-4 flex-grow text-sm font-semibold text-gray-700">
                    <Icon className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <span className="text-left">{name}</span>
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
            </button>
        </Link>
    );
}

function QuickActions() {
    return (
        <div className="flex flex-col p-4 rounded-2xl bg-white shadow-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {quickActions.map((action, index) => (
                    <QuickActionButton key={index} {...action} />
                ))}
            </div>
        </div>
    );
}

// MODIFICADO: Ahora recibe positions para buscar el nombre del puesto
function WelcomeView({ user, positions }) {
    // Filtramos el nombre del puesto comparando Puestos_id con el ID del usuario
    const userPosition = positions.find(
        (p) => String(p.Puestos_id) === String(user?.Personas_puesto)
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center mt-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-5 rounded-full mb-6 shadow-lg shadow-blue-200">
                <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2">

                ¡Qué bueno verte, {user?.Personas_nombres || 'Usuario'} {user?.Personas_apPaterno || 'Usuario'} {user?.Personas_apMaterno || 'Usuario'}!

            </h1>
            <p className="text-gray-500 text-lg max-w-lg">
                Has ingresado al panel de control. Actualmente tu perfil pertenece al departamento de
                <span className="font-bold text-blue-600"> {userPosition?.departamento?.Departamentos_nombre || 'Operaciones'}</span>.
            </p>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-1 gap-4 w-full max-w-md">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Tu Puesto</p>
                    <p className="text-gray-800 font-semibold">
                        {userPosition ? userPosition.Puestos_nombre : "Cargando puesto..."}
                    </p>
                </div>
                {/* <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Licencia</p>
                    <p className="text-gray-800 font-semibold">{user?.Personas_licencia || 'N/A'}</p>
                </div> */}
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL ---

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        ultimas5Unidades: [],
        totalUnidades: 0,
        totalMovimientosHoy: 0,
        totalIncidencias: 0,
    });

    const [positions, setPositions] = useState([]); // Lista de puestos
    const userObject = JSON.parse(localStorage.getItem('user'));

    // Verificación de ROL (Admin = "2" según tu código previo)
    const isAdmin = userObject?.usuario_idRol === "2";

    const getDashboardInfo = async () => {
        if (!isAdmin) return;
        try {
            const response = await fetch(route("DashboardUnidad"));
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Error al obtener datos del dashboard:', error);
        }
    };

    const getPositions = async () => {
        try {
            const data = await fetch(route("puestos.index")).then(res => res.json());
            setPositions(data);
        } catch (error) {
            console.error('Error al obtener los puestos:', error);
        }
    };

    useEffect(() => {
        getDashboardInfo();
        getPositions();
    }, []);

    return (
        <div className="flex flex-col gap-6 pb-8 animate-in fade-in duration-500">
            {/* Header Dinámico */}
            <header className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        {isAdmin ? <LayoutDashboard className="text-blue-600" /> : null}
                        {isAdmin ? "Panel de Control" : "Inicio"}
                    </h1>
                    <p className="text-gray-500 font-medium">
                        {isAdmin
                            ? "Supervisión general de flota y movimientos."
                            : `Bienvenido de nuevo al sistema de logística.`}
                    </p>
                </div>
                {!isAdmin && (
                    <div className="text-right">
                        <span className="text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            Sesión Activa
                        </span>
                    </div>
                )}
            </header>

            {isAdmin ? (
                /* VISTA PARA ADMINISTRADORES */
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            name="Unidades en Patio"
                            value={dashboardData.totalUnidades}
                            icon={Truck}
                            color="text-blue-600"
                        />
                        <StatCard
                            name="Movimientos Hoy"
                            value={dashboardData.totalMovimientosHoy}
                            icon={Clock}
                            color="text-yellow-600"
                        />
                        <StatCard
                            name="Alertas Críticas"
                            value={dashboardData.totalIncidencias}
                            icon={ClipboardList}
                            color="text-red-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 h-full">
                                <div className="flex items-center justify-between mb-6 border-b pb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Últimas Unidades</h2>
                                    <Link to="/unidades" className="text-blue-600 text-sm font-bold hover:underline">Ver todas</Link>
                                </div>
                                <div className="overflow-x-auto">
                                    <Datatable
                                        data={dashboardData.ultimas5Unidades}
                                        virtual={true}
                                        searcher={false}
                                        columns={[
                                            {
                                                header: "Estatus",
                                                accessor: "Unidades_estatus",
                                                width: '10%',
                                                cell: ({ item: { Unidades_estatus } }) => (
                                                    <span className={`inline-flex items-center justify-center rounded-full ${String(Unidades_estatus) === "1" ? "bg-green-400 shadow-sm shadow-green-200" : "bg-red-400 shadow-sm shadow-red-200"} w-3 h-3`} />
                                                ),
                                            },
                                            { header: 'No. Económico', accessor: 'Unidades_numeroEconomico' },
                                            { header: 'Modelo', accessor: 'Unidades_modelo' },
                                            { header: 'Placa', accessor: 'Unidades_placa' },
                                            { header: 'Mantenimiento', accessor: 'Unidades_mantenimiento' },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <QuickActions />
                        </div>
                    </div>
                </>
            ) : (
                /* VISTA PARA USUARIOS OPERATIVOS */
                <WelcomeView user={userObject} positions={positions} />
            )}
        </div>
    );
}