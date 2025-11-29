import React, { useEffect, useState } from 'react';
// 1. Importaciones de React Router Dom para la navegación INTERNA
import { Link, useLocation, useNavigate } from 'react-router-dom';
// 2. Renombramos el Link de Inertia para usarlo SÓLO en Logout
import { Link as InertiaLink } from '@inertiajs/react';
import "../../sass/_leftMenu.scss";
// import logo from '../../../public/img/logo.png'; // No se utiliza en el JSX actual, se comenta.

const LeftMenu = ({ auth }) => {
    const [showMenu, setShowMenu] = useState(true);
    const [userMenus, setUserMenus] = useState([]);
    // Estado que guarda el ID del menú padre que debe estar abierto
    const [openMenuId, setOpenMenuId] = useState(null);

    // Usamos useLocation de React Router Dom
    const location = useLocation();

    // Función para alternar el estado del menú lateral (abrir/cerrar)
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    // Función para manejar el clic en un menú con hijos (acordeón)
    const handleAccordionClick = (menu) => {
        // Si el menú clickeado ya está abierto, lo cierra (lo establece a null), si no, lo abre.
        setOpenMenuId(openMenuId === menu.menu_id ? null : menu.menu_id);
    };

    /**
     * Función recursiva para encontrar el padre del elemento activo y establecer openMenuId.
     * @param {Array} menus - Lista de menús (o submenús).
     * @param {string} pathname - La ruta actual de React Router Dom.
     * @returns {boolean} - True si se encuentra el elemento activo en este subárbol.
     */
    const findAndOpenParent = (menus, pathname) => {
        // Normaliza la ruta actual para manejar '/' o '/dashboard' como inicio si es necesario
        const normalizedPathname = pathname === '/dashboard' ? '/' : pathname;

        for (const menu of menus) {
            // Normaliza la URL del menú
            const normalizedMenuUrl = menu.menu_url === '/dashboard' ? '/' : menu.menu_url;

            if (menu.childs && menu.childs.length > 0) {
                // Llama recursivamente
                const foundInChilds = findAndOpenParent(menu.childs, normalizedPathname);

                // También verifica si el propio menú padre es la ruta activa
                const parentIsActive = normalizedMenuUrl === normalizedPathname;

                // Si el elemento activo se encuentra en los hijos O si el propio padre es la ruta activa
                if (foundInChilds || parentIsActive) {
                    // CAMBIO CLAVE: Establece el ID del padre/acordeón.
                    setOpenMenuId(menu.menu_id);
                    return true;
                }
            } else {
                // Caso: Elemento hoja (Sin hijos)
                if (normalizedMenuUrl === normalizedPathname) {
                    return true; // Encontrado. La recursión ahora subirá y lo abrirá.
                }
            }
        }
        return false;
    };


    // Efecto para cargar los menús al montar el componente
    useEffect(() => {
        getMenus();
    }, []);

    // 💡 EFECTO CLAVE: Se ejecuta con cada cambio de ruta para mantener el acordeón abierto.
    useEffect(() => {
        if (userMenus.length > 0) {
            // Se eliminó setOpenMenuId(null) para evitar el cierre prematuro.
            findAndOpenParent(userMenus, location.pathname);
        }
    }, [location.pathname, userMenus]); // Depende de la ruta actual y de los menús cargados

    // Función asíncrona para obtener los menús del backend
    const getMenus = async () => {
        try {
            // Usando fetch para obtener los menús

            localStorage.setItem('user', JSON.stringify(auth));

            const response = await fetch(window.route("user.menus", auth.Personas_usuarioID));
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

    const sideMenuStyle = {
        // AJUSTE: Coherencia con el SCSS. Abierto: 290px (del SCSS). Colapsado: 49px (del SCSS y la imagen).
        width: showMenu ? '290px' : '49px', 
        transition: 'width 0.3s ease-in-out',
        overflowX: 'hidden',
        minHeight: '100svh',
        backgroundColor: '#053AA7', // Azul marino principal
    };

    // Clases base con Tailwind CSS
    const itemBaseClass = "text-white p-3 cursor-pointer flex items-center relative transition-colors duration-200 ease-in-out";

    // --- Renderizado de Menú (Función Recursiva) ---

    function renderMenu(menu) {
        if (!menu.menu_id) return null;

        const hasChilds = menu.childs && menu.childs.length > 0;

        // Normalización y lógica de resaltado
        const normalizedPathname = location.pathname === '/dashboard' ? '/' : location.pathname;
        const normalizedMenuUrl = menu.menu_url === '/dashboard' ? '/' : menu.menu_url;
        const isSelected = normalizedPathname === normalizedMenuUrl;

        const isOpen = openMenuId === menu.menu_id;

        const submenuStyle = {
            maxHeight: isOpen ? '500px' : '0',
            overflow: 'hidden',
            backgroundColor: '#032b7a', // Fondo más oscuro para submenús
            transition: 'max-height 0.3s ease-in-out, padding 0.3s ease-in-out',
            paddingTop: isOpen ? '5px' : '0',
            paddingBottom: isOpen ? '5px' : '0',
        };

        // Aplica el padding para submenús (nivel 1 vs. nivel 2+)
        const itemPaddingStyle = menu.menu_idPadre !== '0' ? { paddingLeft: '35px' } : { paddingLeft: '20px' };

        if (hasChilds) {
            return (
                <li key={menu.menu_id}>
                    <div
                        // Estilo para el acordeón (padre)
                        className={itemBaseClass + (isOpen ? ' bg-white bg-opacity-15' : ' hover:bg-white hover:bg-opacity-10')}
                        onClick={() => handleAccordionClick(menu)}
                        style={itemPaddingStyle}
                    >
                        <span className="text-white flex items-center justify-between w-full">
                            <span className="truncate">{showMenu ? menu.menu_nombre : '···'}</span>
                            {/* Icono de flecha para el acordeón - MODIFICACIÓN: mr-2 para separarlo de la derecha */}
                            <svg className={`w-4 h-4 mr-2 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'} ${!showMenu ? 'hidden' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </span>
                    </div>
                    <div style={submenuStyle}>
                        <ul className="list-none p-0 m-0">
                            {menu.childs.map((submenu) => renderMenu(submenu))}
                        </ul>
                    </div>
                </li>
            );
        }

        return (
            <li key={menu.menu_id}>
                {/* ENLACE HOJA */}
                <Link
                    to={menu.menu_url}
                    className={itemBaseClass + (isSelected ? " item-selected" : " hover:bg-white hover:bg-opacity-10")}
                    style={{
                        ...itemPaddingStyle,
                        // 🟢 CAMBIO DE FONDO: Aplica un fondo semi-transparente cuando está seleccionado.
                        ...(isSelected ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' } : {})
                    }}
                >
                    <span className="flex relative items-center">
                        <span className="truncate">{showMenu ? menu.menu_nombre : '···'}</span>
                    </span>
                    {isSelected && (
                        // 🟢 BARRA DE RESALTADO: Barra blanca lateral izquierda para indicar selección.
                        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-white rounded-r-md"></span>
                    )}
                </Link>
            </li>
        );
    }

    return (
        <div id="left-menu" className="leftmenu" style={sideMenuStyle} >
            <div className="flex flex-col h-[100svh]" style={{ background: '#053AA7' }}>

                {/* Encabezado del Menú */}
                {/* Se eliminó el padding derecho (pr-7) si showMenu es false para que el botón esté más pegado a la derecha cuando el menú está colapsado a 49px. */}
                <div className={`headerMenu pt-4 pl-7 ${showMenu ? 'pr-7' : 'pr-1'} border-b-2 flex justify-between items-center`} style={{ borderColor: '#d1d1d117' }}>
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

                    {/* Botón de Toggle */}
                    <div className="leftmenu-button cursor-pointer">
                        <button
                            className="w-full h-full"
                            onClick={toggleMenu}
                        >
                            {/* Ajustado tamaño para ocupar mejor el espacio de 49px */}
                            {showMenu ?
                                <svg viewBox="0 0 42 30" className="w-10 h-10">
                                    <path
                                        d="M20 24L13 16L20 8M16 16H35"
                                        fill="none"
                                        stroke={'white'}
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                :
                                <svg viewBox="0 0 64 64" className="w-10 h-10">
                                    <path
                                        d="M12 28h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6zM12 42h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6zM12 14h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6z"
                                        fill={'white'}
                                    />
                                </svg>
                            }
                        </button>
                    </div>
                </div>

                {/* Contenedor Principal de Menús */}
                <div className="containerMenu grow pt-1 overflow-y-auto" >
                    {showMenu && (
                        <ul id="menus-list" className="leftmenu-list list-none p-0 m-0">
                            {userMenus.length > 0 &&
                                userMenus.map((menu) => renderMenu(menu))}
                        </ul>
                    )}
                </div>

                {/* Pie de Menú (Cerrar Sesión) */}
                {showMenu && (
                    <div className="footerMenu border-t-2 pt-2" style={{ borderColor: '#d1d1d117' }}>
                        {/* USA InertiaLink para Logout (Visita Completa) */}
                        <InertiaLink
                            href={window.route('logout')}
                            method="post"
                            as="button"
                            id="logoutButton"
                            className="
                                w-full flex items-center p-2 rounded-lg
                                text-white bg-transparent
                                hover:bg-white hover:bg-opacity-10
                                transition-all duration-200 ease-in-out
                            "
                        >
                            <span className="font-medium text-sm">
                                Cerrar Sesión
                            </span>
                        </InertiaLink>
                    </div>
                )}
            </div>
        </div >
    );
};

export default LeftMenu;