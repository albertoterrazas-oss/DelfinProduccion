import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { toast } from 'sonner';
// Asumiendo que Datatable y LoadingDiv existen en tu entorno de componentes
import Datatable from "@/Components/Datatable";
import LoadingDiv from "@/Components/LoadingDiv";
import request from "@/utils";

import imgatras from '../Catalogos/img/atras.png';
import imgfrente from '../Catalogos/img/frente.png';
import imglado from '../Catalogos/img/lateral.png';



export default function ListaVerificacionImagenes() {
    // const [isDialogOpen, setIsDialogOpen] = useState(false);
    // const [destinations, setDestinations] = useState([]);
    // const [action, setAction] = useState('create');
    // const [errors, setErrors] = useState({});
    // const [isLoading, setIsLoading] = useState(true);

    // const getDestinations = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(route("destinos.index"));
    //         const result = await response.json();

    //         setDestinations(result);

    //     } catch (error) {
    //         console.error('Error al obtener los destinos:', error);
    //         toast.error("No se pudieron cargar los destinos.");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     getDestinations()
    // }, [])

    return (
        <div className="relative h-[100%] pb-4 px-3 overflow-auto blue-scroll">


            <img
                src={imgfrente}
                alt=""
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block' // Recomendado para evitar espacios no deseados debajo de la imagen
                }}
            />

            <img
                src={imglado}
                alt=""
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block' // Recomendado para evitar espacios no deseados debajo de la imagen
                }}
            />

            <img
                src={imgatras}
                alt=""
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block' // Recomendado para evitar espacios no deseados debajo de la imagen
                }}
            />

        </div>
    );
}