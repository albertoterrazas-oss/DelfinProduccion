import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";
import request from "@/utils";


const validateInputs = (validations, data) => {
    let formErrors = {};

    // Validación de Correo (Requerido)
    if (validations.correoNotificaciones_correo) {
        if (!data.correoNotificaciones_correo?.trim()) {
            formErrors.correoNotificaciones_correo = 'El correo es obligatorio.';
        } else if (!/\S+@\S+\.\S/.test(data.correoNotificaciones_correo)) {
            formErrors.correoNotificaciones_correo = 'Formato de correo inválido.';
        }
    }

    // Validación de ID de Usuario (Requerido y debe ser un número)
    if (validations.correoNotificaciones_idUsuario) {
        // Importante: el valor del select es un string que debe convertirse
        const idUsuario = Number(data.correoNotificaciones_idUsuario);
        if (data.correoNotificaciones_idUsuario === "" || isNaN(idUsuario) || idUsuario <= 0) {
            formErrors.correoNotificaciones_idUsuario = 'El ID de Usuario es obligatorio y debe ser un número positivo.';
        }
    }

    return { isValid: Object.keys(formErrors).length === 0, errors: formErrors };
};

// Validaciones requeridas para el formulario de Correo
const correoValidations = {
    correoNotificaciones_correo: true,
    correoNotificaciones_idUsuario: true,
};

// Datos de ejemplo para el estado inicial del formulario de correo
const initialCorreoData = {
    correoNotificaciones_id: null,
    correoNotificaciones_correo: "",
    correoNotificaciones_idUsuario: "", // String para el input/select
    correoNotificaciones_estatus: "1", // Activo por defecto ("1" o "0")
};

// Datos iniciales de la configuración SMTP (Claves usadas en el estado del formulario)
const initialSMTPConfig = {
    smtp_correo: "",
    smtp_password: "",
    smtp_host: "",
    smtp_port: "587",
    smtp_security: "ssl",
};

const validateConfig = (data) => {
    const errors = {};
    if (!data.smtp_correo || !/\S+@\S+\.\S/.test(data.smtp_correo)) {
        errors.smtp_correo = "Correo de servidor es inválido.";
    }
    if (!data.smtp_password) {
        errors.smtp_password = "La contraseña es requerida.";
    }
    if (!data.smtp_host) {
        errors.smtp_host = "El Host es requerido.";
    }
    // Puerto debe ser un número positivo válido
    const port = Number(data.smtp_port);
    if (!data.smtp_port || isNaN(port) || port <= 0 || port > 65535) {
        errors.smtp_port = "El Puerto es inválido (1-65535).";
    }
    if (!data.smtp_security) {
        errors.smtp_security = "El tipo de seguridad (ssl/tls) es requerido.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

// ======================================================================
// ✉️ COMPONENTE: ConfiguracionSMTPForm
// ======================================================================


function ConfiguracionSMTPForm({ config, reloadConfig, isLoading }) {
    const [formData, setFormData] = useState(config || initialSMTPConfig);
    const [isSaving, setIsSaving] = useState(false);
    const [sending, setSending] = useState(false);
    const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
    const [testEmail, setTestEmail] = useState("");

    useEffect(() => {
        setFormData(config || initialSMTPConfig);
    }, [config]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                correoEnvioNotificaciones_correoNotificacion: formData.smtp_correo,
                correoEnvioNotificaciones_passwordCorreo: formData.smtp_password,
                correoEnvioNotificaciones_host: formData.smtp_host,
                correoEnvioNotificaciones_puerto: formData.smtp_port,
                correoEnvioNotificaciones_seguridadSSL: 'ssl',
            };
            await request(route("ConfiguracionCorreoStore"), "POST", payload);
            await reloadConfig();
            toast.success("Configuración guardada correctamente.");
        } catch (error) {
            toast.error("Error al guardar la configuración.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmTestSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await request(route("sendMailTest"), "POST", { destinatario: testEmail });
            toast.success("Correo de prueba enviado.");
            setIsTestDialogOpen(false);
            setTestEmail("");
        } catch (error) {
            toast.error("Error al enviar prueba.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 mb-6">
            {isLoading && <LoadingDiv text="Cargando Configuración..." />}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Correo Servidor</label>
                    <input type="email" name="smtp_correo" value={formData.smtp_correo || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="text" name="smtp_password" value={formData.smtp_password || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Host</label>
                    <input type="text" name="smtp_host" value={formData.smtp_host || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Puerto</label>
                    <input type="number" name="smtp_port" value={formData.smtp_port || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm" required />
                </div>

                <div className="md:col-span-2 lg:col-span-5 flex justify-end pt-2 gap-4">
                    <button type="button" onClick={() => setIsTestDialogOpen(true)} className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-700 transition shadow-md">
                        Enviar Correo de Prueba
                    </button>
                    <button type="submit" disabled={isSaving || isLoading} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
                        {isSaving ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </form>

            <Transition show={isTestDialogOpen}>
                <Dialog open={isTestDialogOpen} onClose={() => setIsTestDialogOpen(false)} className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
                            <DialogTitle className="text-xl font-bold mb-4 border-b pb-2">Enviar Prueba</DialogTitle>
                            <form onSubmit={handleConfirmTestSend}>
                                <label className="block text-sm font-medium mb-1">Correo del destinatario:</label>
                                <input type="email" required value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="w-full border p-2 rounded-md mb-4" placeholder="correo@ejemplo.com" />
                                <div className="flex justify-end gap-3">
                                    <button type="button" onClick={() => setIsTestDialogOpen(false)} className="px-4 py-2 bg-gray-100 rounded-md">Cancelar</button>
                                    <button type="submit" disabled={sending} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                        {sending ? 'Enviando...' : 'Enviar'}
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
// function ConfiguracionSMTPForm({ config, reloadConfig, isLoading }) {
//     // Usamos el estado local, inicializado con la prop 'config' que viene del padre
//     const [formData, setFormData] = useState(config || initialSMTPConfig);
//     const [isSaving, setIsSaving] = useState(false);
//     const [sending, setSending] = useState(false);
//     const [errors, setErrors] = useState({});

//     // Sincroniza el estado local cuando la prop 'config' cambia (ej. después de cargarse inicialmente)
//     useEffect(() => {
//         setFormData(config || initialSMTPConfig);
//     }, [config]);


//     // Manejador para actualizar el estado del formulario con cada cambio de input
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({
//             ...prevData,
//             [name]: value
//         }));
//         // Limpia el error para el campo modificado
//         setErrors(prevErrors => ({
//             ...prevErrors,
//             [name]: undefined
//         }));
//     };

//     // Manejador del envío del formulario
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const validationResult = validateConfig(formData);
//         setErrors(validationResult.errors);

//         if (!validationResult.isValid) {
//             toast.error("Por favor, corrige los errores en el formulario.");
//             return;
//         }

//         setIsSaving(true);

//         try {
//             // **CORRECCIÓN CLAVE:** Mapeo de claves del estado (smtp_*) a las claves del backend (*correoEnvioNotificaciones_*)
//             const payload = {
//                 correoEnvioNotificaciones_correoNotificacion: formData.smtp_correo,
//                 correoEnvioNotificaciones_passwordCorreo: formData.smtp_password,
//                 correoEnvioNotificaciones_host: formData.smtp_host,
//                 correoEnvioNotificaciones_puerto: formData.smtp_port,
//                 correoEnvioNotificaciones_seguridadSSL: formData.smtp_security,
//             };

//             // Usamos 'request'. Asumimos que lanza una excepción en caso de error (4xx/5xx)
//             await request(route("ConfiguracionCorreoStore"), "POST", payload);

//             // Si llegamos aquí, fue exitoso.
//             await reloadConfig(); // Recarga la configuración global en el padre
//             toast.success("Configuración de correo guardada con éxito.");

//         } catch (error) {
//             console.error("Error al guardar la configuración SMTP:", error);
//             // Capturamos la excepción y mostramos un mensaje general
//             toast.error(`Hubo un error al guardar la configuración: ${error.message || 'Error de red o servidor.'}`);
//         } finally {
//             setIsSaving(false);
//         }
//     };

//     const sendMailTest = async () => {
//         setSending(true);
//         try {
//             await request(route("sendMailTest"), "POST", {});
//             toast.success("Correo de prueba enviado con éxito.");
//         } catch (error) {
//             console.error("Error al enviar el correo de prueba:", error);
//             toast.error(`Error al enviar el correo de prueba: ${error.message || 'Error de red o servidor.'}`);
//         } finally {
//             setSending(false);
//         }
//     }

//     return (
//         <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-100 mb-6">
//             {/* <h3 className="text-xl font-bold mb-4 text-blue-700">✉️ Configuración del Servidor de Correo (SMTP)</h3> */}

//             {isLoading && <LoadingDiv text="Cargando Configuración..." />}

//             <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 <div className="lg:col-span-2">
//                     <label htmlFor="smtp_correo" className="block text-sm font-medium text-gray-700">Correo Servidor</label>
//                     <input
//                         id="smtp_correo"
//                         type="email"
//                         name="smtp_correo"
//                         value={formData.smtp_correo || ''}
//                         onChange={handleChange}
//                         placeholder="servidor@dominio.com"
//                         className={`mt-1 block w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${errors.smtp_correo ? 'border-red-500' : 'border-gray-300'}`}
//                         required
//                     />
//                     {errors.smtp_correo && <p className="mt-1 text-xs text-red-500">{errors.smtp_correo}</p>}
//                 </div>

//                 <div>
//                     <label htmlFor="smtp_password" className="block text-sm font-medium text-gray-700">Contraseña</label>
//                     <input
//                         id="smtp_password"
//                         type="text"
//                         name="smtp_password"
//                         value={formData.smtp_password || ''}
//                         onChange={handleChange}
//                         placeholder="Contraseña"
//                         className={`mt-1 block w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${errors.smtp_password ? 'border-red-500' : 'border-gray-300'}`}
//                         required
//                     />
//                     {errors.smtp_password && <p className="mt-1 text-xs text-red-500">{errors.smtp_password}</p>}
//                 </div>

//                 <div>
//                     <label htmlFor="smtp_host" className="block text-sm font-medium text-gray-700">Host</label>
//                     <input
//                         id="smtp_host"
//                         type="text"
//                         name="smtp_host"
//                         value={formData.smtp_host || ''}
//                         onChange={handleChange}
//                         placeholder="smtp.ejemplo.com"
//                         className={`mt-1 block w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${errors.smtp_host ? 'border-red-500' : 'border-gray-300'}`}
//                         required
//                     />
//                     {errors.smtp_host && <p className="mt-1 text-xs text-red-500">{errors.smtp_host}</p>}
//                 </div>

//                 <div>
//                     <label htmlFor="smtp_port" className="block text-sm font-medium text-gray-700">Puerto</label>
//                     <input
//                         id="smtp_port"
//                         type="number"
//                         name="smtp_port"
//                         value={formData.smtp_port || ''}
//                         onChange={handleChange}
//                         placeholder="587"
//                         className={`mt-1 block w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${errors.smtp_port ? 'border-red-500' : 'border-gray-300'}`}
//                         required
//                     />
//                     {errors.smtp_port && <p className="mt-1 text-xs text-red-500">{errors.smtp_port}</p>}
//                 </div>

//                 <div>
//                     <label htmlFor="smtp_security" className="block text-sm font-medium text-gray-700">Tipo de seguridad</label>
//                     <input
//                         id="smtp_security"
//                         type="text"
//                         name="smtp_security"
//                         value={formData.smtp_security || ''}
//                         onChange={handleChange}
//                         placeholder="ssl o tls"
//                         className={`mt-1 block w-full rounded-md border p-2 text-sm focus:border-blue-500 focus:ring-blue-500 ${errors.smtp_security ? 'border-red-500' : 'border-gray-300'}`}
//                         required
//                     />
//                     {errors.smtp_security && <p className="mt-1 text-xs text-red-500">{errors.smtp_security}</p>}
//                 </div>

//                 <div className="md:col-span-2 lg:col-span-5 flex justify-end pt-2 gap-4">
//                     <button
//                         onClick={sendMailTest}
//                         disabled={sending}
//                         className="px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-md shadow-md hover:bg-green-700 disabled:cursor-not-allowed transition duration-150 ease-in-out"
//                     >
//                         {isSaving ? 'Enviando...' : 'Enviar Correo de Prueba'}
//                     </button>
//                     {/* <button
//                         disabled={isSaving || isLoading}
//                         className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
//                         onClick={sendTestMail}
//                     >
//                         Enviar correo de prueba
//                     </button> */}
//                     <button
//                         type="submit"
//                         disabled={isSaving || isLoading}
//                         className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-150 ease-in-out"
//                     >
//                         {isSaving ? 'Guardando...' : 'Guardar Configuración'}
//                     </button>
//                 </div>
//             </form>

//         </div>
//     );
// }

// ----------------------------------------------------------------------

// ✉️ COMPONENTE: CorreoFormDialog
function CorreoFormDialog({ isOpen, closeModal, onSubmit, correoToEdit, action, errors, setErrors }) {
    const [correoData, setCorreoData] = useState(initialCorreoData);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    // Lógica para cargar datos del correo a editar o inicial
    useEffect(() => {
        if (isOpen) {
            const dataToLoad = correoToEdit && correoToEdit.correoNotificaciones_id ? correoToEdit : initialCorreoData;
            setCorreoData({
                ...dataToLoad,
                // Asegurar que el idUsuario sea string para el select
                correoNotificaciones_idUsuario: String(dataToLoad.correoNotificaciones_idUsuario || ""),
            });
            setErrors({});
        }
    }, [isOpen, correoToEdit, setErrors]);

    // Lógica para cargar la lista de usuarios
    const getUsers = async () => {
        try {
            const response = await fetch(route("users.index"));
            const data = await response.json();
            setUsers(data.data || data || []);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            toast.error("No se pudieron cargar los usuarios.");
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? (checked ? "1" : "0") : value;

        setCorreoData(prevData => ({
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Convertir idUsuario a número antes del submit final
        const dataToSend = {
            ...correoData,
            correoNotificaciones_idUsuario: Number(correoData.correoNotificaciones_idUsuario)
        };

        try {
            // El padre (Correos) maneja la validación y el guardado
            await onSubmit(dataToSend);
            closeModal();
        } catch (error) {
            // El error se maneja en el padre, y no cerramos el modal si falla
        } finally {
            setLoading(false);
        }
    };


    const dialogTitle = action === 'create' ? 'Crear Nuevo Correo' : 'Editar Correo';

    return (
        <Transition show={isOpen}>
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl relative">
                        {loading && <LoadingDiv />}
                        <DialogTitle className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                            {dialogTitle}
                        </DialogTitle>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">

                            {/* Input Correo */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Correo Electrónico: <span className="text-red-500">*</span></span>
                                <input
                                    type="email"
                                    name="correoNotificaciones_correo"
                                    value={correoData.correoNotificaciones_correo || ''}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.correoNotificaciones_correo ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    placeholder="ejemplo@dominio.com"
                                    required
                                />
                                {errors.correoNotificaciones_correo && <p className="text-red-500 text-xs mt-1">{errors.correoNotificaciones_correo}</p>}
                            </label>

                            {/* Select Usuario */}
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">Usuario: <span className="text-red-500">*</span></span>
                                <select
                                    name="correoNotificaciones_idUsuario"
                                    value={correoData.correoNotificaciones_idUsuario || ''}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.correoNotificaciones_idUsuario ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                                    required
                                >
                                    <option value="" disabled>Selecciona un Usuario</option>
                                    {users.map((user) => (
                                        <option
                                            key={user.Personas_usuarioID}
                                            value={user.Personas_usuarioID}
                                        >
                                            {user.nombre_completo}
                                        </option>
                                    ))}
                                </select>
                                {errors.correoNotificaciones_idUsuario && <p className="text-red-500 text-xs mt-1">{errors.correoNotificaciones_idUsuario}</p>}
                            </label>

                            {/* Checkbox Estatus */}
                            <div className="flex justify-center w-full mt-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="correoNotificaciones_estatus"
                                        checked={correoData.correoNotificaciones_estatus === "1"}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Activo</span>
                                </label>
                            </div>

                            {/* Botones */}
                            <div className="col-span-1 flex justify-end gap-3 pt-4 border-t mt-4">
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
                                    {loading ? (action === 'create' ? 'Registrando...' : 'Actualizando...') : (action === 'create' ? 'Guardar Correo' : 'Actualizar Correo')}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </Transition>
    )
}

// ----------------------------------------------------------------------

// 👑 COMPONENTE PRINCIPAL: Correos
export default function Correos() {
    // Estado para Correos de Notificación
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [correos, setCorreos] = useState([]);
    const [action, setAction] = useState('create');
    const [correoData, setCorreoData] = useState(initialCorreoData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Estado para Configuración SMTP
    const [smtpConfig, setSmtpConfig] = useState(initialSMTPConfig);
    const [isSmtpLoading, setIsSmtpLoading] = useState(true);

    // --- Lógica de Correos de Notificación (Fetch de la tabla) ---
    const getCorreos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(route("correos.index"));
            const result = await response.json();
            setCorreos(result.data || result);

        } catch (error) {
            console.error('Error al obtener los correos:', error);
            toast.error("No se pudieron cargar los correos de notificación.");
        } finally {
            setIsLoading(false);
        }
    }

    // --- Lógica de Configuración SMTP (Fetch del formulario) ---
    const getSmtpConfig = async () => {
        setIsSmtpLoading(true);
        try {
            const response = await fetch(route("indexconfiguracioncorreo"));
            if (!response.ok) {
                // Si fetch falla aquí, lanzamos para capturar el error general
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const result = await response.json();

            // **Mapeo de claves del backend a claves de estado**
            setSmtpConfig({
                smtp_correo: result.correoEnvioNotificaciones_correoNotificacion || "",
                smtp_password: result.correoEnvioNotificaciones_passwordCorreo || "",
                smtp_host: result.correoEnvioNotificaciones_host || "",
                smtp_port: String(result.correoEnvioNotificaciones_puerto || "587"),
                smtp_security: result.correoEnvioNotificaciones_seguridadSSL || "ssl",
            });
        } catch (error) {
            console.error('Error al obtener la configuración SMTP:', error);
            // Si no se pudo cargar, se mantiene el initialSMTPConfig
            setSmtpConfig(initialSMTPConfig);
        } finally {
            setIsSmtpLoading(false);
        }
    }


    useEffect(() => {
        getCorreos();
        getSmtpConfig();
    }, [])

    // --- Lógica de Modales ---
    const openCreateModal = () => {
        setAction('create');
        setCorreoData(initialCorreoData);
        setErrors({});
        setIsDialogOpen(true);
    };

    const openEditModal = (correo) => {
        setAction('edit');
        setCorreoData(correo);
        setErrors({});
        setIsDialogOpen(true);
    };

    const closeModal = () => {
        setIsDialogOpen(false);
        setCorreoData(initialCorreoData);
        setErrors({});
    };

    // --- Lógica de Correos de Notificación (Submit) ---
    const submit = async (data) => {

        console.log("entro");
        // Validación
        const validationResult = validateInputs(correoValidations, data);

        if (!validationResult.isValid) {
            setErrors(validationResult.errors);
            toast.error("Por favor, corrige los errores en el formulario.");
            //   console.log("dsd");
            // Lanza un error para detener el flujo en CorreoFormDialog
            throw new Error("Validation Failed");
        }

        const isEdit = data.correoNotificaciones_id;


        // console.log("isedit",isEdit)
        const ruta = isEdit
            ? route("correos.update", { id: data.correoNotificaciones_id })
            : route("correos.store");

        const method = isEdit ? "PUT" : "POST";
        const successMessage = isEdit ? "Correo actualizado con éxito." : "Correo creado con éxito.";

        try {
            const payload = {
                correoNotificaciones_id: data.correoNotificaciones_id,

                correoNotificaciones_correo: data.correoNotificaciones_correo,
                correoNotificaciones_idUsuario: data.correoNotificaciones_idUsuario,
                correoNotificaciones_estatus: data.correoNotificaciones_estatus,
            };

            // Usamos la función 'request'
            await request(ruta, method, payload);

            await getCorreos(); // Recarga la tabla
            toast.success(successMessage);
        } catch (error) {
            console.error("Error al guardar el correo:", error);
            toast.error(`Hubo un error al guardar el correo: ${error.message || 'Error de red.'}`);
            throw error; // Propagar para que el diálogo sepa que falló
        }
    };


    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Configuración de Correo</h2>
            </div>

            {/* Componente de Formulario de Configuración SMTP */}
            <ConfiguracionSMTPForm
                config={smtpConfig}
                isLoading={isSmtpLoading}
                reloadConfig={getSmtpConfig}
            />

            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Correos Electrónicos de Notificación</h2>
                <button
                    onClick={openCreateModal}
                    className="flex items-center px-4 py-2 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition duration-150 ease-in-out"
                >
                    + Nuevo Correo
                </button>
            </div>

            {/* Sección de Gestión de Correos de Notificación (Datatable) */}
            {isLoading ? (
                <div className='flex items-center justify-center h-[100%] w-full'> <LoadingDiv /> </div>

            ) : (
                <Datatable
                    data={correos}
                    virtual={true}
                    columns={[
                        {
                            header: "Estatus",
                            accessor: "correoNotificaciones_estatus",
                            width: '10%',
                            cell: ({ item: { correoNotificaciones_estatus } }) => {
                                const isActivo = String(correoNotificaciones_estatus) === "1";
                                const color = isActivo ? "bg-green-300" : "bg-red-300";

                                return (
                                    <span className={`inline-flex items-center justify-center rounded-full ${color} w-3 h-3`}
                                        title={isActivo ? "Activo" : "Inactivo"}
                                    />
                                );
                            },
                        },
                        { header: 'Correo', accessor: 'correoNotificaciones_correo' },
                        { header: 'Usuario', accessor: 'usuario_nombre_completo' },

                        {
                            header: "Acciones", accessor: "Acciones", cell: (eprops) => (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openEditModal(eprops.item)}
                                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                                    >
                                        Editar
                                    </button>
                                </div>
                            )
                        },
                    ]}
                />
            )}


            {/* Componente Modal de Headless UI */}
            <CorreoFormDialog
                isOpen={isDialogOpen}
                closeModal={closeModal}
                onSubmit={submit}
                correoToEdit={correoData}
                action={action}
                errors={errors}
                setErrors={setErrors}
            />

        </div>
    );
}