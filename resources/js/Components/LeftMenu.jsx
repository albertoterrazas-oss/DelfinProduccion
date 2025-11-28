import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../sass/_leftMenu.scss";
// import { useContext } from "react";
// import UserMenusContext from "@/Context/UserMenusContext";
// import LogoutIcon from '../png/logoutIcon.png';
import { useForm } from "@inertiajs/react";
import useStore from "@/Stores/useStore";


const LeftMenu = ({ auth }) => {
    const {
        userMenus,
        searchMenuTerm,
        selectedMenu,
        filteredMenus,
        showMenu,
        setShowMenu,
        setUserMenus,
        setLoggedUser,
        setSelectedMenu,
        setSearchMenuTerm,
        setFilteredMenus
    } = useStore()
    const menuClass = showMenu ? "leftmenu open" : "leftmenu close";
    const [activeMenu, setActiveMenu] = useState("");
    const [activeMenu2, setActiveMenu2] = useState("");
    const [activeMenu3, setActiveMenu3] = useState("");
    // const { selectedMenu, SetSelectedMenuFunc, state, dispatch } = useContext(UserMenusContext);
    const [empresas, setEmpresas] = useState();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [open, setOpen] = useState(false);

    const menuSearcherRef = useRef()
    const menuSearcherIconRef = useRef()
    const [isInputFocused, setIsInputFocused] = useState(false);
    // const navigate = useNavigate();
    const { post } = useForm();
    const savedColor = '#053AA7';
    const [user, setUser] = useState();
    const [color, setColor] = useState('#FFFFFF');

    
   

    // const setPageTitle = (menu1, menu2 = '', menu3 = '') => {
    //     const title = {
    //         menu1: menu1,
    //         menu2: menu2,
    //         menu3: menu3,
    //     }
    //     localStorage.setItem('title', JSON.stringify(title))
    // }

    function renderMenu(menu, selectedMenu) {
        const handleClick = (menu) => {
            if (typeof menu !== "string") {
                setSelectedMenu(menu);
                setPageTitle(menu.menu_nombre);
                localStorage.setItem("selectedMenu", JSON.stringify(menu))
                // console.log("selectedMenu", JSON.stringify(menu.menu_id));
                // ClickMenu(JSON.stringify(menu.menu_id));
            }
        };

       

        return (
            <React.Fragment>
                {menu.childs && menu.childs.length !== 0 ? (
                    <div className={`leftmenu-item accordion`} onClick={() => handleClick(menu.menu_nombre)}>
                        <a className="text-white ">
                            {/* {renderTooltipIcon(menu.menu_tooltip) && <span className="mr-1 w-6 h-6 ">{renderTooltipIcon(menu.menu_tooltip)}</span>} */}
                            {menu.menu_nombre}
                        </a>
                    </div>
                ) : (
                    <Link
                        to={menu.menu_url}
                        onClick={() => handleClick(menu)}
                        className={`leftmenu-item ${selectedMenu?.menu_nombre === menu.menu_nombre ? "item-selected" : ""}`}
                    >
                        <span className="flex relative items-center text-white">
                            {/* {renderTooltipIcon(menu.menu_tooltip) && <span className="mr-2 w-6 h-6">{renderTooltipIcon(menu.menu_tooltip)}</span>} */}
                            {menu.menu_nombre}
                        </span>

                        {selectedMenu?.menu_nombre === menu.menu_nombre && (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 32 32"
                                xmlns="http://www.w3.org/2000/svg"
                                className="absolute -left-8 top-1/2 transform -translate-y-1/2"
                            >
                                <path
                                    d="M10 8 L24 16 L10 24 Z"
                                    fill={`${color}`}
                                    style={{ background: color }}
                                />
                            </svg>
                        )}
                    </Link>

                )}

                {menu.childs && menu.childs.length !== 0 && (
                    <div className="submenu-panel">
                        <ul className="leftmenu-list">
                            {menu.childs.map((submenu, index2) => (
                                <li key={index2}>
                                    {renderMenu(submenu, selectedMenu)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </React.Fragment>
        );

    }

    useEffect(() => {
        if (filteredMenus) {
            const handleClick = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu === this) {
                    this.classList.remove("active");
                    subPanel.style.maxHeight = null;
                    setActiveMenu(null);
                } else {
                    if (activeMenu) {
                        activeMenu.classList.remove("active");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("active");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu(this);
                }
            };
            const handleClick2 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu2 === this) {
                    this.classList.remove("active2");
                    subPanel.style.maxHeight = null;
                    setActiveMenu2(null);
                } else {
                    if (activeMenu2) {
                        activeMenu2.classList.remove("active2");
                        subPanel.style.maxHeight = null;
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                    }
                    this.classList.add("active2");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu2(this);
                }
            };
            const handleClick3 = function () {
                const subPanel = this.nextElementSibling;
                if (activeMenu3 === this) {
                    this.classList.remove("active3");
                    subPanel.style.maxHeight = null;
                    setActiveMenu3(null);
                } else {
                    if (activeMenu3) {
                        activeMenu3.classList.remove("active3");
                        // activeMenu.nextElementSibling.style.maxHeight = null;
                        subPanel.style.maxHeight = null;
                    }
                    this.classList.add("active3");
                    subPanel.style.maxHeight = subPanel.scrollHeight + "vh";
                    setActiveMenu3(this);
                }
            };

            const accordions = document.querySelectorAll(".accordion");
            accordions.forEach((accordion) => {
                accordion.addEventListener("click", handleClick);
            });
            const accordions2 = document.querySelectorAll(".accordion2");
            accordions2.forEach((accordion) => {
                accordion.addEventListener("click", handleClick2);
            });
            const accordions3 = document.querySelectorAll(".accordion3");
            accordions3.forEach((accordion) => {
                accordion.addEventListener("click", handleClick3);
            });

            return () => {
                accordions.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick);
                });
                accordions2.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick2);
                });
                accordions3.forEach((accordion) => {
                    accordion.removeEventListener("click", handleClick3);
                });
            };
        }
    }, [filteredMenus, activeMenu, activeMenu2, activeMenu3, setSelectedMenu]);

  

    return (
        <div id="left-menu" className={menuClass} style={{ backgroundColor: savedColor }}>
            <div className="flex flex-col h-[100svh]">
                <div className="headerMenu pt-4 pl-7 pr-7 border-b-2 border-[#d1d1d117]">
                    <div className="user-info">

                        <div className="flex items-center gap-4">
                        

                            <div>
                                <h3
                                    className="text-[11px] w-24 overflow-hidden text-ellipsis whitespace-nowrap"
                                    title="Panel de administracion"
                                >
                                    {/* {auth.user
                                        ? auth.user.usuario_nombre
                                        : <div className="w-24 h-4 bg-gray-300 animate-pulse" />
                                    } */}
                                    Delfin Tecnologias
                                </h3>

                                <div className="flow-root">
                                    <ul className="-m-1 flex flex-wrap">
                                        <li className="p-1 leading-none">
                                            <a className="text-[#fcfcfc] text-[14px] truncate text-bold">
                                                {/* {auth.user ? auth.user.usuario_username :
                                                    <div className="w-36 h-4 bg-gray-300 animate-pulse" />
                                                } */}
                                                Panel de administracion
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="flex items-center justify-center">
                        <div className="leftmenu-button cursor-pointer">
                            <button className="w-full h-full" onClick={() => setShowMenu(showMenu)}>

                                {showMenu == true ?
                                    <svg viewBox="0 0 42 30" className="w-full h-10">
                                        <path
                                            d="M20 24L13 16L20 8M16 16H35"
                                            fill="none"
                                            stroke={`${color}`}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg> :
                                    <svg viewBox="0 0 64 64" className="w-12 h-10">
                                        <path
                                            d="M12 28h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6zM12 42h42a3 3 0 0 1 0 6h-42a3 3 0 0 1 0-6z"
                                            fill={`${color}`}
                                        />
                                    </svg>
                                }
                            </button>
                        </div>
                    </div>
                </div>
               
                <div className="containerMenu grow pt-1 blue-scroll" >
                    <ul id="menus-list" className="leftmenu-list">
                        {filteredMenus && filteredMenus.length > 0 &&
                            filteredMenus.map((menu, index) => (
                                <li key={index}>
                                    {renderMenu(menu, selectedMenu)}
                                </li>
                            ))}
                    </ul>
                </div>
             
                <div className="footerMenu border-t-2 border-[#d1d1d117] pt-2">
                    {/* Contenedor del Botón de Cerrar Sesión */}
                    <button
                        id="logoutButton"
                        onClick={(e) => logout()}
                        className="
      w-full flex items-center justify-between p-2 rounded-lg 
      text-white bg-transparent 
      hover:bg-blue-100 hover:text-blue-600 
      transition-all duration-200 ease-in-out
    "
                    >
                        {/* Texto del Botón (primero para que esté a la izquierda) */}
                        <span className="font-medium text-sm">
                            Cerrar Sesión
                        </span>

                        {/* Ícono de Salida (después del texto, y se moverá a la derecha) */}
                        {/* <img
                            src={LogoutIcon}
                            alt="Cerrar Sesión"
                            className="w-5 h-5" // Eliminamos 'mr-3' ya que ahora está a la derecha
                        /> */}
                    </button>
                </div>

            </div>

        </div >
    );
};

export default LeftMenu;




