import Datatable from "@/components/Datatable";
import LoadingDiv from "@/components/LoadingDiv";
import request from "@/utils";
// import { ChevronsRight, SendHorizontal } from "lucide-react";


import {
    Truck,
    User,
    Plus,
    ArrowRight,
    ClipboardList,
    FileText,
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    ChevronsRight, SendHorizontal
} from 'lucide-react';

import { useEffect, useState } from "react";
import { toast } from 'sonner';

export default function QuienConQuienTransporte() {
    const [modData, setModData] = useState([]);
    const [states, setStates] = useState({
        loading: true,
        open: false,
        choferes: [],
        destinos: [],
        motivos: [],
        quienConQuien: [],
        dashboard: [],
        tipo: ''
    });

    const userObject = JSON.parse(localStorage.getItem('user'));

    const getWho = async () => {
        const [
            destinos,
            motivos,
            choferes,
            Qconquien,
            dashboard
        ] = await Promise.all([
            request(route('DestinosQuiencQuien')),
            request(route('MotivosQuiencQuien')),
            request(route('users.index')),
            request(route('QuienconQuienUnidades')),
            request(route('QuienconQuienUnidadesDashboard')),


        ]);

        setStates(prev => ({
            ...prev,
            quienConQuien: Qconquien,
            motivos: motivos,
            destinos: destinos,
            choferes: choferes,
            dashboard: dashboard,
            loading: false,
        }));
    };



    const processWhoEquals = (who = {}, whoData = states.quienConQuien) => {
        const unSavedWho = []; // aquí puedes implementar tu lógica real
        const unsavedWhoIds = unSavedWho.map(reg => reg.CUA_unidadID);

        // NUEVO CÓDIGO
        const newWhoByWhoData = whoData.map(reg => {
            // Extrae 'quienConQuien_checkout' y la ignora.
            // 'restOfReg' contiene todas las otras propiedades de 'reg'.
            const { quienConQuien_checkout, ...restOfReg } = reg;

            // Devuelve el nuevo objeto sin la propiedad excluida.
            return restOfReg;
        });
        const whoIndex = newWhoByWhoData.findIndex(q => q.CUA_unidadID == who.CUA_unidadID);
        if (whoIndex !== -1) {
            newWhoByWhoData[whoIndex] = who;
        }

        return {
            newModData: [
                ...modData.filter(q => !unsavedWhoIds.includes(q.CUA_unidadID) && q.CUA_unidadID !== who.CUA_unidadID),
                ...unSavedWho,
                who
            ],
            unsavedWhoIds,
            newWhoByWhoData
        };
    };

    const updateWhoRow = (e) => {
        if (e.newData) {
            const newData = { ...e.oldData, ...e.newData };
            const { newModData, newWhoByWhoData } = processWhoEquals(newData);
            setStates(prev => ({ ...prev, quienConQuien: newWhoByWhoData }));
            setModData(newModData);
        }
    };


    // const submit = async () => {
    //     try {
    //         const response = await fetch(route('changesswho'), {
    //             method: "POST",
    //             body: JSON.stringify({ quienconquien: states.quienConQuien }),
    //             headers: { "Content-Type": "application/json" }
    //         });

    //         if (response.ok) {
    //             setStates({ ...states, open: false });
    //             toast.success("Se ha actualizado correctamente el quienconquien");

    //             getWho();
    //             // showNotification('Actualización exitosa', 'success', 'metroui', 'bottomRight', 5000);
    //         } else {
    //             const errorData = await response.json();
    //             const message = errorData?.message || 'Error al actualizar';
    //             showNotification(message, 'error', 'metroui', 'bottomRight', 7000);
    //         }
    //     } catch (error) {
    //         showNotification('Error inesperado: ' + error.message, 'error', 'metroui', 'bottomRight', 7000);
    //     }
    // };


    const SubmitQuien = async (e) => {
        try {
            const response = await fetch(route('WhoDestint'), {
                method: "POST",
                body: JSON.stringify({ quienconquien: e , user: userObject.Personas_usuarioID }),
                headers: { "Content-Type": "application/json" }
            });

            if (response.ok) {
                setStates({ ...states, open: false });
                toast.success("Se ha actualizado correctamente el quienconquien");

                getWho();
            } else {
                const errorData = await response.json();
                const message = errorData?.message || 'Error al actualizar';
                showNotification(message, 'error', 'metroui', 'bottomRight', 7000);
            }
        } catch (error) {
            showNotification('Error inesperado: ' + error.message, 'error', 'metroui', 'bottomRight', 7000);
        }
    };

    useEffect(() => {
        getWho();
    }, []);

    // DEFINE ESTA FUNCIÓN FUERA DEL ARRAY DE COLUMNAS, EN EL MISMO COMPONENTE QUE LAS USA
    const hasData = (value) => {
        // Verifica si el valor no es null ni undefined
        if (value == null) {
            return false;
        }
        // Para strings, verifica que no esté vacío después de quitar espacios
        if (typeof value === 'string') {
            return value.trim().length > 0;
        }
        // Para números/IDs, si no es null/undefined, se considera que tiene datos
        return true;
    };

    function StatCard({ name, value, color = 'text-gray-900', icon: Icon }) {
        return (
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-between transition transform hover:scale-[1.01] duration-300 ease-in-out">
                <div>
                    <p className="text-sm font-medium text-gray-500">{name}</p>
                    <p className={`mt-1 text-4xl font-extrabold ${color}`}>{value}</p>
                </div>
                {/* Icono con color tenue y un círculo de fondo para contraste */}
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-')} bg-opacity-10`}>
                    {Icon && <Icon className={`w-8 h-8 ${color}`} />}
                </div>
            </div>
        );
    }

    const stats = [
        { name: 'Unidades fuera de area', value: states.dashboard.totalVerde ?? 0, icon: Truck, color: 'text-green-600' },
        { name: 'Unidades en patio', value: states.dashboard.totalAmarillo ?? 0, icon: Truck, color: 'text-yellow-600' },
        { name: 'Unidades sin asignar ', value: states.dashboard.totalRojo ?? 0, icon: Truck, color: 'text-red-500' },
    ];

    return (
        <div className="relative h-[98%] pb-4 px-3 overflow-auto blue-scroll">
            {states.loading &&
                <div className='flex items-center justify-center h-[100%] w-full'> <LoadingDiv /> </div>

            }
            {!states.loading &&
                <div className="flex flex-col h-full">

                    <div className="flex justify-between items-center p-3 border-b mb-4">
                        <h2 className="text-3xl font-bold text-gray-800">Gestion de Quien con quien </h2>
                       
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                        {stats.map((stat) => (
                            <StatCard key={stat.name} {...stat} />
                        ))}
                    </div>


                    <div className="quienConQuienTablaTotal">
                        <Datatable
                            data={states.quienConQuien}
                            virtual={true}
                            tableId={'CUA_unidadID'}
                            searcher={false}
                            handleRowUpdating={updateWhoRow}
                            editingMode={{ mode: "cell", allowUpdating: true }}
                            columns={
                                [
                                    {
                                        header: "Estatus",
                                        accessor: "Unidades_estatus",
                                        width: '5%',
                                        cell: ({ item: { CUA_choferID, CUA_motivoID, CUA_destino, UltimoMovimiento } }) => {
                                            const allDataPresent = hasData(CUA_choferID) && hasData(CUA_motivoID) && hasData(CUA_destino);
                                            let color = "bg-red-300"; // ROJO: Por defecto o si faltan datos
                                            if (allDataPresent) {
                                                if (UltimoMovimiento === "SALIDA") {
                                                    color = "bg-green-300"; // VERDE: Todo completo y SALIDA
                                                } else if (UltimoMovimiento === "ENTRADA") {
                                                    color = "bg-yellow-300"; // AMARILLO: Todo completo y ENTRADA
                                                }
                                            }
                                            return (
                                                <span className={`inline-flex items-center justify-center rounded-full ${color} w-4 h-4`} />
                                            );
                                        },
                                    },

                                    {
                                        header: 'Unidad',
                                        accessor: 'Unidades_numeroEconomico',
                                        alignment: 'start',
                                        width: '10%',
                                        editable: false
                                    },
                                    {
                                        header: 'Choferes',
                                        accessor: 'CUA_choferID',
                                        width: '30%',
                                        lookup: {
                                            dataSource: states.choferes,
                                            displayExpr: "nombre_completo",
                                            valueExpr: "Personas_usuarioID",
                                        },
                                    },
                                    {
                                        header: 'Motivos',
                                        accessor: 'CUA_motivoID',
                                        width: '20%',
                                        lookup: {
                                            dataSource: states.motivos,
                                            displayExpr: "Motivos_nombre",
                                            valueExpr: "Motivos_motivoID",
                                        },
                                    },
                                    {
                                        header: 'Destinos',
                                        accessor: 'CUA_destino',
                                        width: '30%',
                                        lookup: {
                                            dataSource: states.destinos,
                                            displayExpr: "Destinos_Nombre",
                                            valueExpr: "Destinos_Id",
                                        },
                                    },
                                    {
                                        header: "Acciones",
                                        accessor: "Acciones",
                                        width: '5%',
                                        cell: ({ item }) => {
                                            const { CUA_choferID, CUA_motivoID, CUA_destino, UltimoMovimiento } = item;

                                            // 1. Verificar si todos los datos requeridos están presentes (similar a isGreen en el original)
                                            const allDataPresent = hasData(CUA_choferID) && hasData(CUA_motivoID) && hasData(CUA_destino);

                                            // 2. Determinar si el botón debe estar deshabilitado/oculto (solo si el estado es VERDE)
                                            // Está deshabilitado/oculto si: Todos los datos están presentes Y UltimoMovimiento es "SALIDA"
                                            const isDisabled = allDataPresent && UltimoMovimiento === "SALIDA";

                                            // Si isDisabled es true (Estado VERDE), el botón NO es visible/interactuable.
                                            if (isDisabled) {
                                                return <div style={{ width: '20px', height: '20px' }}></div>; // Retorna un espacio vacío
                                            }

                                            // Si llegamos aquí, el estado es ROJO o AMARILLO, por lo que el botón es visible y activo.
                                            const iconColor = 'green';
                                            const cursorStyle = 'pointer';

                                            const handleClick = () => {
                                                // Aquí ya no necesitamos el chequeo de `!isDisabled` porque se maneja con el `if (isDisabled)` de arriba.
                                                // Pero si decides no devolver nada para `isDisabled`, la verificación de abajo sigue siendo importante.
                                                if (!isDisabled) {
                                                    SubmitQuien(item);
                                                }
                                            };

                                            return (
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <SendHorizontal
                                                        style={{
                                                            width: '20px',
                                                            color: iconColor,
                                                            cursor: cursorStyle,
                                                            opacity: 1 // La opacidad siempre es 1 ya que el caso 'deshabilitado' está oculto
                                                        }}
                                                        onClick={handleClick}
                                                    />
                                                </div>
                                            );
                                        },
                                    }
                                ]
                            }
                        />
                    </div>
                </div>
            }
        </div>
    );
}
