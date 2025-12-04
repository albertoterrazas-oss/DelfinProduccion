import { useEffect, useState, useMemo, useRef } from "react";
import { Dialog } from '@headlessui/react';
import { toast } from 'sonner';

// ⚠️ SOLUCIÓN AL TREE SHAKING: Importación explícita de todos los íconos
// que se usarán en el selector y la tabla. Si deseas más, agrégalos aquí.
import { 
    X, Search, ChevronLeft, ChevronRight, SquarePen, AlertCircle, 
    Home, Settings, User, Menu, LogOut, Award, BarChart, Bell, Book, 
    Car, Check, Clock, Code, CreditCard, Database, DollarSign, Download, 
    Eye, Heart, Key, Lightbulb, Link, List, Lock, Mail, Map, Monitor, 
    Moon, Phone, Plus, Power, Save, Star, Sun, Trash2, Truck, Upload, 
    Users, Video, Volume2, Wallet, Layers, Filter, Anchor, Apple, Archive, 
    Briefcase, Calendar, Camera, Cloud, Coffee, Construction, Droplet, 
    Feather, FileText, FlaskConical, Folder, Gift, Globe, Hammer, Image, 
    Info, Minus, MoreHorizontal, Move, Music, Package, Paperclip, Pause, 
    PenTool, Pin, Plane, Printer, QrCode, Radar, Send, Server, Tablet, 
    Tag, Terminal, ThumbsUp, ToggleLeft, Watch, Wifi, Zap, ZoomIn, ZoomOut 
} from 'lucide-react'; 

import Datatable from "@/Components/Datatable"; // Asumo que este componente existe
import LoadingDiv from "@/Components/LoadingDiv"; // Asumo que este componente existe
import request from "@/utils"; // Asumo que esta utilidad existe

// ----------------------------------------------------
// I. UTILERÍAS GLOBALES Y DATOS INICIALES
// ----------------------------------------------------

const route = (name, params = {}) => {
    const routeMap = {
        "menus.index": "/api/menus",
        "menus.store": "/api/menus",
        "menus.update": `/api/menus/${params}`,
    };
    return routeMap[name] || `/${name}`;
};

const menuValidations = {
    menu_nombre: true,
    menu_url: true,
    estatus: true,
};

const validateInputs = (validations, data) => {
    let formErrors = {};
    if (validations.menu_nombre && !data.menu_nombre?.trim()) formErrors.menu_nombre = 'El nombre del menú es obligatorio.';
    if (validations.menu_url && !data.menu_url?.trim()) formErrors.menu_url = 'La URL es obligatoria.';
    if (validations.estatus && !data.estatus?.trim()) formErrors.estatus = 'El estatus es obligatorio.';
    return { isValid: Object.keys(formErrors).length === 0, errors: formErrors };
};

const initialMenuData = {
    menu_id: null,
    menu_nombre: "",
    menu_idPadre: null,
    menu_url: "",
    menu_tooltip: "", // Propiedad manejada
    menu_icono: "Home", // Propiedad manejada
    estatus: "1",
};

/**
 * Mapeo de componentes para acceder a ellos por string (solución al Tree Shaking).
 */
const ICON_COMPONENTS = {
    Home, Settings, User, Menu, LogOut, Award, BarChart, Bell, Book, Car, 
    Check, Clock, Code, CreditCard, Database, DollarSign, Download, Eye, Heart, 
    Key, Lightbulb, Link, List, Lock, Mail, Map, Monitor, Moon, Phone, Plus, 
    Power, Save, Star, Sun, Trash2, Truck, Upload, Users, Video, Volume2, 
    Wallet, Layers, Filter, Anchor, Apple, Archive, Briefcase, Calendar, 
    Camera, Cloud, Coffee, Construction, Droplet, Feather, FileText, FlaskConical, 
    Folder, Gift, Globe, Hammer, Image, Info, Minus, MoreHorizontal, Move, 
    Music, Package, Paperclip, Pause, PenTool, Pin, Plane, Printer, QrCode, 
    Radar, Send, Server, Tablet, Tag, Terminal, ThumbsUp, ToggleLeft, Watch, 
    Wifi, Zap, ZoomIn, ZoomOut 
};

// La lista de nombres de íconos disponibles
const allIconNames = Object.keys(ICON_COMPONENTS);


// ----------------------------------------------------
// II. COMPONENTE: SELECTOR DE ÍCONOS EN CUADRÍCULA CON BÚSQUEDA Y PAGINACIÓN
// ----------------------------------------------------

// Componente del Modal con la Cuadrícula y Paginación
function IconGridPickerModal({ isOpen, closeModal, onSelect, selectedIconName }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ICONS_PER_PAGE = 30;

    const filteredIcons = useMemo(() => {
        if (!searchTerm) return allIconNames;
        
        return allIconNames.filter(name => 
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredIcons.length / ICONS_PER_PAGE);
    const startIndex = (currentPage - 1) * ICONS_PER_PAGE;
    const currentIcons = filteredIcons.slice(startIndex, startIndex + ICONS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);


    const handleIconClick = (name) => {
        onSelect(name); // Guarda el nombre del ícono
        closeModal();
    };
    
    const hasIconsLoaded = allIconNames.length > 0;

    return (
        <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
                    <div className="flex justify-between items-center border-b pb-3 mb-4">
                        <Dialog.Title className="text-xl font-bold text-gray-800">
                            Seleccionar Ícono ({filteredIcons.length} disponibles)
                        </Dialog.Title>
                        <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    {hasIconsLoaded ? (
                        <>
                            {/* Buscador */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar ícono por nombre..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>

                            {/* Cuadrícula de Íconos */}
                            <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-2 border rounded-lg">
                                {currentIcons.length > 0 ? (
                                    currentIcons.map((name) => {
                                        const IconComponent = ICON_COMPONENTS[name]; 
                                        const isSelected = name === selectedIconName;
                                        return (
                                            <div
                                                key={name}
                                                onClick={() => handleIconClick(name)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer transition-all border-2 
                                                    ${isSelected ? 'border-blue-500 bg-blue-100 shadow-md' : 'border-gray-100 hover:bg-gray-50 hover:border-gray-300'}`}
                                                title={name}
                                            >
                                                <span className={`mb-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
                                                    {IconComponent && <IconComponent size={24} />}
                                                </span>
                                                <span className="text-xs font-medium text-gray-600 truncate w-full text-center">
                                                    {name}
                                                </span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-6 text-center py-10 text-gray-500">
                                        No se encontraron íconos con el término "{searchTerm}".
                                    </div>
                                )}
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-4 space-x-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 border rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="text-sm font-medium text-gray-700">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                         <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-lg font-semibold text-red-700 mb-2">⚠️ Error de Carga de Librería</p>
                            <p className="text-sm text-red-600">
                                La lista de íconos (**lucide-react**) está vacía. Confirma la instalación y el reinicio del servidor.
                            </p>
                        </div>
                    )}

                </Dialog.Panel>
            </div>
        </Dialog>
    );
}

// Componente de Display
function IconDisplayField({ selectedIconName, onOpenModal }) {
    const CurrentIcon = ICON_COMPONENTS[selectedIconName] || AlertCircle; 

    return (
        <div className="relative">
            <label className="text-sm font-medium text-gray-700 block mb-1">
                Ícono Seleccionado:
            </label>
            
            <div 
                className="flex items-center justify-between rounded-md border border-gray-300 p-2 text-sm cursor-pointer hover:border-blue-500 transition-all"
                onClick={onOpenModal}
            >
                <div className="flex items-center">
                    <span className="mr-3 text-blue-600">
                        {CurrentIcon && <CurrentIcon size={20} />}
                    </span>
                    <span className="font-medium text-gray-700">
                         {selectedIconName}
                    </span>
                </div>
                <SquarePen size={18} className="text-gray-500" />
            </div>
            <p className="text-xs mt-1 text-gray-500">Haz clic para buscar y seleccionar.</p>
        </div>
    );
}

// ----------------------------------------------------
// III. COMPONENTE: MODAL DEL FORMULARIO (MenuFormDialog)
// ----------------------------------------------------

function MenuFormDialog({ isOpen, closeModal, onSubmit, menuToEdit, action, errors, setErrors }) {
    const [menuData, setMenuData] = useState(initialMenuData);
    const [loading, setLoading] = useState(false);
    const [menus2, setMenus2] = useState();
    const [isIconModalOpen, setIsIconModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const dataToLoad = menuToEdit
                ? {
                    ...menuToEdit,
                    menu_nombre: menuToEdit.menu_nombre || "",
                    menu_idPadre: menuToEdit.menu_idPadre || null,
                    menu_url: menuToEdit.menu_url || "",
                    menu_tooltip: menuToEdit.menu_tooltip || "",
                    menu_icono: menuToEdit.menu_icono || "Home", 
                    estatus: String(menuToEdit.estatus) === "1" ? "1" : "0", 
                }
                : initialMenuData;
            setMenuData(dataToLoad);
            setErrors({});
            if (!menus2) fetchdata(); 
        }
    }, [isOpen, menuToEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = value;

        if (name === 'menu_idPadre') {
            finalValue = value === "" ? null : Number(value);
        }
        if (type === 'checkbox') {
            finalValue = checked ? "1" : "0";
        }

        // Esta lógica maneja la actualización de menu_tooltip y otros campos de texto
        setMenuData(prevData => ({
            ...prevData,
            [name]: finalValue
        }));

        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // GUARDA EL ÍCONO SELECCIONADO EN EL ESTADO
    const handleIconSelect = (iconName) => {
        setMenuData(prevData => ({
            ...prevData,
            menu_icono: iconName,
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            // menuData contiene el menu_icono y el menu_tooltip
            await onSubmit(menuData); 
            closeModal();
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchdata = async () => {
        try {
            const response = await fetch(route("menus.index"));
            const data = await response.json();
            setMenus2([{ menu_id: '0', menu_nombre: "Raiz" }].concat(data)); 
        } catch (e) {
             console.error("Fallo al cargar la lista de menús padre:", e);
        }
    };

    useEffect(() => {
        if (isOpen && !menus2) {
             fetchdata();
        }
    }, [isOpen]); 

    const dialogTitle = action === 'create' ? 'Crear Nuevo Elemento de Menú' : 'Editar Elemento de Menú';

    return (
        <>
            <Dialog open={isOpen} onClose={closeModal} className="relative z-40">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl relative">

                        {loading && <LoadingDiv />}

                        <Dialog.Title className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                            {dialogTitle}
                        </Dialog.Title>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <div className="space-y-3">
                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Nombre del Menú: <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="menu_nombre"
                                        value={menuData.menu_nombre}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.menu_nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                    {errors.menu_nombre && <p className="text-red-500 text-xs mt-1">{errors.menu_nombre}</p>}
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">URL/Ruta: <span className="text-red-500">*</span></span>
                                    <input
                                        type="text"
                                        name="menu_url"
                                        value={menuData.menu_url}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.menu_url ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    />
                                    {errors.menu_url && <p className="text-red-500 text-xs mt-1">{errors.menu_url}</p>}
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Menú Padre:</span>
                                    <select
                                        name="menu_idPadre" 
                                        value={menuData.menu_idPadre === null ? '' : String(menuData.menu_idPadre)} 
                                        onChange={handleChange} 
                                        className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.menu_idPadre ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    >
                                        <option value="" disabled={menuData.menu_idPadre !== null}>Selecciona un menú padre</option>
                                        {(menus2 ?? []).map((menu) => {
                                            if (action === 'edit' && menu.menu_id === menuData.menu_id) return null;
                                            
                                            const nombreJerarquico = menu.menu_id === '0' 
                                                ? '— Raíz (Sin Padre) —'
                                                : `${menu.menu_padre?.menu_padre?.menu_nombre ? '/ ' + menu.menu_padre?.menu_padre?.menu_nombre : ''} ${menu.menu_padre?.menu_nombre ? '/ ' + menu.menu_padre?.menu_nombre : ''} ${'/ ' + menu.menu_nombre}`;

                                            return (
                                                <option
                                                    key={menu.menu_id} 
                                                    value={menu.menu_id === '0' ? '' : menu.menu_id} 
                                                >
                                                    {nombreJerarquico}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {errors.menu_idPadre && <p className="text-red-500 text-xs mt-1">{errors.menu_idPadre}</p>}
                                </label>

                                <label className="block">
                                    <span className="text-sm font-medium text-gray-700">Tooltip (Ayuda):</span>
                                    <input
                                        type="text"
                                        name="menu_tooltip" // ⬅️ Nombre correcto para la actualización
                                        value={menuData.menu_tooltip}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </label>
                                
                                <IconDisplayField 
                                    selectedIconName={menuData.menu_icono} 
                                    onOpenModal={() => setIsIconModalOpen(true)} 
                                />

                                <div className="flex justify-center w-full pt-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="estatus"
                                            checked={menuData.estatus == "1"} 
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Activo (Estatus)</span>
                                    </label>
                                </div>

                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {loading ? (action === 'create' ? 'Registrando...' : 'Actualizando...'): (action === 'create' ? 'Guardar Menú' : 'Actualizar Menú')}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <IconGridPickerModal
                isOpen={isIconModalOpen}
                closeModal={() => setIsIconModalOpen(false)}
                onSelect={handleIconSelect}
                selectedIconName={menuData.menu_icono}
            />
        </>
    )
}

// ----------------------------------------------------------------------
// IV. COMPONENTE PRINCIPAL (Menus)
// ----------------------------------------------------------------------

export default function Menus() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [menus, setMenus] = useState([]);
    const [action, setAction] = useState('create');
    const [menuData, setMenuData] = useState(initialMenuData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const openCreateModal = () => {
        setAction('create');
        setMenuData(initialMenuData);
        setErrors({});
        setIsDialogOpen(true);
    };

    const openEditModal = (menu) => {
        setAction('edit');
        setMenuData(menu);
        setErrors({});
        setIsDialogOpen(true);
    };

    const closeModal = () => {
        setIsDialogOpen(false);
        setMenuData(initialMenuData);
        setErrors({});
    };

    const submit = async (data) => {
        setErrors({});
        const validationResult = validateInputs(menuValidations, data);

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            toast.error("Por favor, corrige los errores en el formulario.");
            throw new Error("Validation Failed");
        }

        const isEdit = data.menu_id;
        const ruta = isEdit ? route("menus.update", data.menu_id) : route("menus.store");
        const method = isEdit ? "PUT" : "POST";
        const successMessage = isEdit ? "Menú actualizado con éxito." : "Menú creado con éxito.";

        try {
            await request(ruta, method, data); 
            await getMenus();
            toast.success(successMessage);
        } catch (error) {
            console.error("Error al guardar el menú:", error);
            toast.error("Hubo un error al guardar el menú.");
            throw error;
        }
    };

    const getMenus = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(route("menus.index"));
            if (!response.ok) throw new Error("Fallo al cargar menús");
            const data = await response.json();
            setMenus(data);
        } catch (error) {
            console.error('Error al obtener los menús:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getMenus()
    }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">

            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Menús </h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Menú
                </button>
            </div>
            {isLoading ? (
                <div className='flex items-center justify-center h-[100%] w-full'> <LoadingDiv /> </div>

            ) : (
                <Datatable
                    data={menus}
                    virtual={true}
                    columns={[
                        {
                            header: "Estatus",
                            accessor: "menu_estatus",
                            cell: ({ item: { menu_estatus } }) => {
                                const color = String(menu_estatus) === "1"
                                    ? "bg-green-300"
                                    : "bg-red-300";

                                return (
                                    <span className={`inline-flex items-center justify-center rounded-full ${color} w-4 h-4`} />
                                );
                            },
                        },
                        { header: 'Nombre', accessor: 'menu_nombre' },
                        { header: 'ID Padre', accessor: 'menu_idPadre' },
                        { header: 'URL', accessor: 'menu_url' },
                        { header: 'Tooltip', accessor: 'menu_tooltip' },
                        // Columna para mostrar el ícono en la tabla
                        { 
                            header: 'Icono', 
                            accessor: 'menu_icono', 
                            cell: ({ item: { menu_icono } }) => {
                                const IconComponent = ICON_COMPONENTS[menu_icono] || AlertCircle; 
                                return IconComponent ? <IconComponent size={20} className="text-gray-600" /> : <span>-</span>;
                            } 
                        },
                        {
                            header: "Acciones", accessor: "Acciones", cell: (eprops) => (<>
                                <button
                                    onClick={() => openEditModal(eprops.item)}
                                    className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition"
                                >
                                    Editar
                                </button>
                            </>)
                        },
                    ]}
                />
            )}
            
            <MenuFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={submit}
                menuToEdit={menuData}
                action={action}
                errors={errors}
                setErrors={setErrors}
            />

        </div>
    );
}