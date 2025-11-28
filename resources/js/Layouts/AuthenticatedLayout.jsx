// import React, { useState, useEffect } from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';

import { Link } from '@inertiajs/react';
import logo from '../../../public/img/logo.png';
// Se elimina la importación de SCSS
// import { Route, Routes, useLocation, useNavigate } from 'react-router';

const defaultColor = 'white';
import { Route, Routes, useLocation, useNavigate } from 'react-router';
import LoadingDiv from '@/Components/LoadingDiv';

const routes = [
    {
        path: "/",
        import: lazy(() => import('../Pages/Home'))
    },
    {
        path: "/dashboard",
        import: lazy(() => import('../Pages/Home'))
    },
    {
        path: "/unidades",
        import: lazy(() => import('../Pages/Catalogos/Unidades'))
    },
    {
        path: "/usuarios",
        import: lazy(() => import('../Pages/Catalogos/Usuarios'))
    },
    {
        path: "/motivos",
        import: lazy(() => import('../Pages/Catalogos/Motivos'))
    },
    {
        path: "/destino",
        import: lazy(() => import('../Pages/Catalogos/Destinos'))
    },

    {
        path: "/reportes",
        import: lazy(() => import('../Pages/Catalogos/Reportes'))
    },
    {
        path: "/registrosalida",
        import: lazy(() => import('../Pages/Catalogos/RegistroYSalidaUnificado'))
    },
    {
        path: "/menus",
        import: lazy(() => import('../Pages/Catalogos/Menus'))
    },

    {
        path: "/listaverificacion",
        import: lazy(() => import('../Pages/Catalogos/ListaVerificacion'))
    },

    {
        path: "/puestos",
        import: lazy(() => import('../Pages/Catalogos/Puestos'))
    },
    {
        path: "/departamentos",
        import: lazy(() => import('../Pages/Catalogos/Departamentos'))
    },
    {
        path: "/QuienConQuienTransporte",
        import: lazy(() => import('../Pages/Catalogos/QuienConQuienTransporte'))
    },
    {
        path: "/roles",
        import: lazy(() => import('../Pages/Catalogos/Roles'))
    },
    {
        path: "/correosnotificaciones",
        import: lazy(() => import('../Pages/Catalogos/Correos'))
    },
]


export default function Authenticated({ user, header, children }) {
    // Estado para controlar si el menú lateral está abierto (true) o cerrado (false)
    const [showMenu, setShowMenu] = useState(true);
    // Estado para almacenar la lista completa de menús del usuario
    const [userMenus, setUserMenus] = useState([]);
    // Estado para rastrear el menú hoja actualmente seleccionado (para resaltarlo)
    const [selectedMenu, setSelectedMenu] = useState(null);
    // Estado para controlar qué menú padre (con submenús) está abierto (usando su ID)
    const [openMenuId, setOpenMenuId] = useState(null);

    // Función para alternar el estado del menú lateral (abrir/cerrar)
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    // Función para manejar el clic en un menú con hijos (acordeón)
    const handleAccordionClick = (menu) => {
        // Cierra si se hace clic en el mismo menú, o abre el nuevo
        setOpenMenuId(openMenuId === menu.menu_id ? null : menu.menu_id);
    };

    // Función para manejar el clic en un menú de hoja (enlace)
    const handleLinkClick = (menu) => {
        setSelectedMenu(menu); // Establece el menú seleccionado para resaltarlo
    };

    // Efecto para cargar los menús al montar el componente
    useEffect(() => {
        getMenus();
    }, []);
    // setusuario(user)
    // console.log(user);

    // Función asíncrona para obtener los menús del backend
    const getMenus = async () => {
        try {
            // Asegúrate de que la función 'route' esté definida globalmente por Laravel/Ziggy
            const response = await fetch(route("user.menus", user.Personas_usuarioID));
            if (!response.ok) {
                throw new Error('Error al cargar menús del usuario');
            }
            const data = await response.json();
            setUserMenus(data);
        } catch (error) {
            console.error('Error en getMenus:', error.message);
        }
    };

    // --- Estilos Base ---

    // Estilo base para el menú lateral (abierto/cerrado)
    const sideMenuStyle = {
        width: showMenu ? '280px' : '80px', // Cambia el ancho del menú
        transition: 'width 0.3s ease-in-out',
        overflowX: 'hidden',
        minHeight: '100svh',
        backgroundColor: '#053AA7',
    };

    // Estilo base para todos los elementos del menú (usa clases de Tailwind para el hover)
    const itemBaseClass = "text-white p-3 cursor-pointer flex items-center relative transition-colors duration-200 ease-in-out";

    /**
     * Función recursiva para renderizar la estructura de menús anidados.
     * @param {object} menu - El objeto de menú a renderizar.
     */
    function renderMenu(menu) {
        if (!menu.menu_id) return null;

        const hasChilds = menu.childs && menu.childs.length > 0;
        const isSelected = selectedMenu?.menu_url === menu.menu_url;
        const isOpen = openMenuId === menu.menu_id;

        // Estilos para la altura y transición del submenú (LÓGICA DEL ACORDEÓN)
        const submenuStyle = {
            maxHeight: isOpen ? '500px' : '0', // Altura máxima para expandir o 0 para colapsar
            overflow: 'hidden',
            backgroundColor: '#032b7a',
            transition: 'max-height 0.3s ease-in-out, padding 0.3s ease-in-out',
            paddingTop: isOpen ? '5px' : '0',
            paddingBottom: isOpen ? '5px' : '0',
        };

        // Determina el padding horizontal para el item (sangría)
        const itemPaddingStyle = menu.menu_idPadre !== '0' ? { paddingLeft: '35px' } : { paddingLeft: '20px' };

        // Si el menú tiene hijos, renderiza un elemento de acordeón
        if (hasChilds) {
            return (
                <li key={menu.menu_id}>
                    {/* Contenedor del título del menú padre */}
                    <div
                        className={itemBaseClass + (isOpen ? ' bg-white bg-opacity-15' : ' hover:bg-white hover:bg-opacity-10')}
                        onClick={() => handleAccordionClick(menu)}
                        style={itemPaddingStyle}
                    >
                        <a className="text-white flex items-center justify-between w-full">
                            {/* Nombre del menú padre - SOLO MOSTRAR SI EL MENÚ ESTÁ ABIERTO */}
                            {showMenu && menu.menu_nombre}

                            {/* Icono de flecha de acordeón */}
                            <svg className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'} ${!showMenu ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>

                    {/* Panel del submenú con estilos en línea para el acordeón */}
                    <div style={submenuStyle}>
                        <ul className="list-none p-0 m-0">
                            {menu.childs.map((submenu) => renderMenu(submenu))}
                        </ul>
                    </div>
                </li>
            );
        }

        // Si el menú es una hoja (enlace), renderiza un Link de Inertia
        return (
            <li key={menu.menu_id}>
                <Link
                    href={menu.menu_url}
                    onClick={() => handleLinkClick(menu)}
                    className={itemBaseClass + (isSelected ? " item-selected" : " hover:bg-white hover:bg-opacity-10")}
                    style={{
                        ...itemPaddingStyle,
                        // Estilo extra para el item seleccionado (barra lateral)
                        ...(isSelected ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' } : {})
                    }}
                >
                    <span className="flex relative items-center">
                        {/* El nombre del menú solo se muestra si el menú está abierto */}
                        {showMenu ? menu.menu_nombre : '···'}
                    </span>
                    {/* Indicador visual de selección (Barra vertical) */}
                    {isSelected && (
                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-white rounded-r-md"></span>
                    )}
                </Link>
            </li>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Menú Lateral (Left Menu) */}
            <div id="left-menu" className="leftmenu" style={sideMenuStyle} >
                <div className="flex flex-col h-[100svh]" style={{ background: '#053AA7' }}>

                    {/* Header del Menú */}
                    <div className="headerMenu pt-4 pl-7 pr-7 border-b-2 flex justify-between items-center" style={{ borderColor: '#d1d1d117' }}>

                        {/* Contenido del Header (Solo se muestra si el menú está abierto) */}
                        {showMenu && (
                            <div className="user-info">
                                <div className="flex items-center ">
                                    <div>
                                        <h3
                                            className="text-[11px] w-24 overflow-hidden text-ellipsis whitespace-nowrap text-white"
                                            title="Panel de administracion"
                                        >
                                            Delfin Tecnologias
                                        </h3>
                                        <div className="flow-root">
                                            <ul className="-m-1 flex flex-wrap">
                                                <li className="p-1 leading-none">
                                                    <a className="text-[#fcfcfc] text-[14px] truncate font-bold">
                                                        Panel de administracion
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="leftmenu-button cursor-pointer">
                            <button
                                className="w-full h-full"
                                onClick={toggleMenu}
                            >
                                {showMenu ?
                                    // Icono de cerrar (flecha) cuando el menú está abierto
                                    <svg viewBox="0 0 42 30" className="w-full h-10">
                                        <path
                                            d="M20 24L13 16L20 8M16 16H35"
                                            fill="none"
                                            stroke={defaultColor}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    :
                                    // Icono de abrir (hamburguesa) cuando el menú está cerrado
                                    <svg viewBox="0 0 64 64" className="w-12 h-10">
                                        <path
                                            d="M12 28h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6zM12 42h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6zM12 14h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6z"
                                            fill={defaultColor}
                                        />
                                    </svg>
                                }
                            </button>
                        </div>
                    </div>

                    {/* Contenedor de Menús (Solo se muestra si el menú está abierto) */}
                    <div className="containerMenu grow pt-1 overflow-y-auto" >
                        {showMenu && (
                            <ul id="menus-list" className="leftmenu-list list-none p-0 m-0">
                                {userMenus.length > 0 &&
                                    userMenus.map((menu) => renderMenu(menu))}
                            </ul>
                        )}
                    </div>

                    {/* Footer del Menú (Solo se muestra si el menú está abierto) */}
                    {showMenu && (
                        <div className="footerMenu border-t-2 pt-2" style={{ borderColor: '#d1d1d117' }}>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                id="logoutButton"
                                className="
                                    w-full flex items-center p-2 rounded-lg
                                    text-white bg-transparent
                                    hover:bg-blue-100 hover:text-blue-600
                                    transition-all duration-200 ease-in-out
                                "
                            >
                                <span className="font-medium text-sm">
                                    Cerrar Sesión
                                </span>
                            </Link>
                        </div>
                    )}
                </div>
            </div >

            {/* SECCIÓN DEL CONTENIDO PRINCIPAL Y HEADER SUPERIOR */}
            <div className="flex-1">
                {header && (
                    <header className="p-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center space-x-3">
                                {header}
                            </div>

                            <div className="flex flex-col items-end">
                                <Link href={'/dashboard'} className="w-full">
                                    <img
                                        src={logo}
                                        alt="Logo delfin"
                                        className="h-6 sm:h-8"
                                    />
                                </Link>
                            </div>
                        </div>
                    </header>
                )}

                <main className="p-4">
                    {children}

                    <Routes>
                        {
                            routes.map((route, index) => (
                                <Route key={index} lazy={route.import} path={route.path} element={(
                                    <Suspense fallback={
                                        <div className="h-full">
                                            <LoadingDiv />
                                        </div>
                                    }>
                                        <route.import auth={user} />
                                    </Suspense>
                                )} />
                            ))
                        }
                    </Routes>
                </main>
            </div>
        </div>
    );
}