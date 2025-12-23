import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";
import request from "@/utils";

// --- Helpers ---
const route = (name, params = {}) => {
    const id = params.Asuntos_id;
    const routeMap = {
        "asuntos.index": "/api/asuntos",
        "asuntos.store": "/api/asuntos",
        "asuntos.update": `/api/asuntos/${id}`,
    };
    return routeMap[name] || `/${name}`;
};

const validateAsuntos = (data) => {
    let errors = {};
    if (!data.Asuntos_nombre?.trim()) errors.Asuntos_nombre = 'El nombre es obligatorio.';
    return { isValid: Object.keys(errors).length === 0, errors };
};

const initialAsuntoData = {
    Asuntos_id: null,
    Asuntos_nombre: "",
    Asuntos_descripcion: ""
};

// --- Modal Form Component ---
function AsuntoFormDialog({ isOpen, closeModal, onSubmit, dataToEdit, action, errors, setErrors }) {
    const [formData, setFormData] = useState(initialAsuntoData);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(dataToEdit || initialAsuntoData);
            setErrors({});
        }
    }, [isOpen, dataToEdit]);

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "Asuntos_nombre") {
            value = value.toUpperCase();
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            closeModal();
        } catch (error) {
            // Manejado en el componente padre
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition show={isOpen}>
            <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-xl rounded-xl bg-white p-6 shadow-2xl relative">
                        {loading && <LoadingDiv />}
                        <DialogTitle className="text-2xl font-bold mb-4 text-gray-900 border-b pb-2">
                            {action === 'create' ? 'Crear Nuevo Asunto' : 'Editar Asunto'}
                        </DialogTitle>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre del Asunto:</label>
                                <input
                                    type="text"
                                    name="Asuntos_nombre"
                                    value={formData.Asuntos_nombre}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border p-2 text-sm ${errors.Asuntos_nombre ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.Asuntos_nombre && <p className="text-red-500 text-xs mt-1">{errors.Asuntos_nombre}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción:</label>
                                <textarea
                                    name="Asuntos_descripcion"
                                    rows="3"
                                    value={formData.Asuntos_descripcion || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm bg-gray-100 rounded-md">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                    {action === 'create' ? 'Guardar' : 'Actualizar'}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </Dialog>
        </Transition>
    );
}

// --- Main Component ---
export default function Asuntos() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [asuntos, setAsuntos] = useState([]);
    const [action, setAction] = useState('create');
    const [currentData, setCurrentData] = useState(initialAsuntoData);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getAsuntos = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(route("asuntos.index"));
            const result = await response.json();
            setAsuntos(result);
        } catch (error) {
            toast.error("Error al cargar los asuntos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { getAsuntos(); }, []);

    const openCreateModal = () => {
        setAction('create');
        setCurrentData(initialAsuntoData);
        setIsDialogOpen(true);
    };

    const openEditModal = (item) => {
        setAction('edit');
        setCurrentData(item);
        setIsDialogOpen(true);
    };

    const submit = async (data) => {
        const validation = validateAsuntos(data);
        if (!validation.isValid) {
            setErrors(validation.errors);
            toast.error("Revisa el formulario.");
            throw new Error("Validation Failed");
        }

        const isEdit = data.Asuntos_id;
        const url = isEdit ? route("asuntos.update", { Asuntos_id: data.Asuntos_id }) : route("asuntos.store");
        const method = isEdit ? "PUT" : "POST";

        try {
            await request(url, method, {
                Asuntos_nombre: data.Asuntos_nombre,
                Asuntos_descripcion: data.Asuntos_descripcion
            });
            await getAsuntos();
            toast.success(isEdit ? "Actualizado" : "Creado");
        } catch (error) {
            toast.error("Error al procesar la solicitud.");
            throw error;
        }
    };

    return (
        <div className="p-4 h-full overflow-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800">Gestión de Asuntos</h2>
                <button onClick={openCreateModal} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">
                    + Nuevo Asunto
                </button>
            </div>

            {isLoading ? (
                <LoadingDiv />
            ) : (
                <Datatable
                    data={asuntos}
                    virtual={true}
                    columns={[
                        // { header: 'ID', accessor: 'Asuntos_id' },
                        { header: 'Nombre', accessor: 'Asuntos_nombre' },
                        { header: 'Descripción', accessor: 'Asuntos_descripcion' },
                        {
                            header: "Acciones",
                            cell: (props) => (
                                <button onClick={() => openEditModal(props.item)} className="text-blue-600 bg-blue-50 px-3 py-1 rounded hover:bg-blue-100">
                                    Editar
                                </button>
                            )
                        },
                    ]}
                />
            )}

            <AsuntoFormDialog
                isOpen={isDialogOpen}
                closeModal={() => setIsDialogOpen(false)}
                onSubmit={submit}
                dataToEdit={currentData}
                action={action}
                errors={errors}
                setErrors={setErrors}
            />
        </div>
    );
}