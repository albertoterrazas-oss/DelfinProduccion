import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { toast } from 'sonner';
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";
import request from "@/utils";
import { Truck, UsersRound, SendHorizontal,Check } from 'lucide-react';


export default function MonitorCodes() {
    const [departments, setDepartments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    const getCodes = async () => {
        try {
            setIsLoading(true);
            const data = await fetch(route("codigos.index")).then(res => res.json());
            setDepartments(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
    }

    useEffect(() => {
        getCodes()
    }, [])


    const handleConfirm = async (unidad, code, type) => {
        try {
           
            toast.info("Verificando código de autorización...");

            // **IMPORTANTE**: Asegúrate de que `route('verifycode')` apunta al endpoint correcto
            const response = await fetch(route('verifycode'), {
                method: 'POST',
                body: JSON.stringify({ unit: unidad, code: code, type: type }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorText = await response.text();
                toast.error(`Código incorrecto o error del servidor: ${errorText}`);
                setError('Código incorrecto o expirado.');
                throw new Error("Respuesta de verifycode no ok");
            }
            toast.success("Autorización completada y verificada.");
            getCodes(); // Refresca la lista después de la autorización

        } catch (err) {
            console.error('Error en el proceso de verificación de código:', err);
            if (!error) {
                toast.error('Fallo de comunicación con el servidor.');
            }
        }
    };

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">
            <div className="flex justify-between items-center p-3 border-b mb-4">
                <h2 className="text-3xl font-bold text-gray-800">Monitor de codigos</h2>

            </div>

            {isLoading ? (
                <div className='flex items-center justify-center h-[100%] w-full'> <LoadingDiv /> </div>
            ) : (
                <Datatable
                    data={departments}
                    virtual={true}
                    columns={[

                        {
                            header: "Estatus",
                            accessor: "codigoAutorizacion_estatus",
                            width: '20%',
                            cell: ({ item: { codigoAutorizacion_estatus } }) => {
                                const color = String(codigoAutorizacion_estatus) === "1"
                                    ? "bg-green-300" // Si es "1"
                                    : "bg-red-300";  // Si NO es "1" (incluyendo "2", "0", null, etc.)

                                return (
                                    <span className={`inline-flex items-center justify-center rounded-full ${color} w-4 h-4`} />
                                );
                            },
                        },
                        {
                            header: "Codigo",
                            accessor: "codigoAutorizacion_codigo",
                            width: '30%',
                            cell: ({ item: { codigoAutorizacion_codigo } }) => {
                                const code = String(codigoAutorizacion_codigo || '').padEnd(6, ' '); // Asegura que sea un string y tiene 6 dígitos (ajusta 6 a tu necesidad)
                                const digitBoxes = Array(code.length).fill(null); // Crea un array para mapear los dígitos

                                return (
                                    <div className="flex justify-center space-x-2">
                                        {digitBoxes.map((_, index) => {
                                            const digit = code[index] === ' ' ? '' : code[index]; // Muestra espacio como vacío
                                            const isActive = false; // Ya no es interactivo, así que no hay estado activo

                                            return (
                                                <div
                                                    key={index}
                                                    className={`w-10 h-8 flex items-center justify-center text-xl font-mono border-2 rounded-lg 
                            ${isActive
                                                            ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50'
                                                            : 'border-gray-300 bg-gray-100'}
                            transition-all duration-150`}
                                                >
                                                    {digit}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            },
                        },
                        { header: 'Unidad', width: '20%', accessor: 'unidades.Unidades_numeroEconomico' },
                        { header: 'Fecha', width: '20%', accessor: 'codigoAutorizacion_fecha' },
                        { header: 'Tipo de movimiento', width: '10%', accessor: 'codigoAutorizacion_motivo' },

                        {
                            header: "Autorizar",
                            accessor: "Acciones",
                            width: '10%',
                            cell: ({ item }) => {
                                return (
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Check
                                            style={{
                                                width: '20px',
                                                color: 'green',
                                                cursor: 'pointer', // Añadido para que el usuario sepa que es clickable
                                                opacity: 1
                                            }}
                                            // CORRECCIÓN: Envolver en una función flecha
                                            onClick={() => handleConfirm(
                                                item.unidades.Unidades_unidadID,
                                                item.codigoAutorizacion_codigo,
                                                item.codigoAutorizacion_motivo
                                            )}
                                        />
                                    </div>
                                );
                            },
                        }
                    ]}
                />
            )}

        </div>
    );
}