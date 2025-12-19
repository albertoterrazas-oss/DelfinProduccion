import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, User, MapPin, Send, Hash, Loader2, Lock, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const AuthorizationCard = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Iniciamos en true para la primera carga
    const [statusError, setStatusError] = useState(null); 
    const [data, setData] = useState({
        asign: '', unfg: '', oprtd: '', dest: '', cgp: '', tytype: ''
    });

    // 1. Capturar parámetros de la URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('cgp') || 'N/A';
        
        setData({
            asign: params.get('asign') || 'N/A',
            unfg: params.get('unfg') || 'N/A',
            oprtd: params.get('oprtd') || 'N/A',
            dest: (params.get('dest') || 'N/A').trim(),
            cgp: code,
            tytype: params.get('tytype') || ''
        });
    }, []);

    // 2. Validar el estado del código al cargar
    const checkCodeStatus = async () => {
        if (data.cgp === 'N/A' || !data.cgp) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(route('CodigoverificacionEstado'), {
                method: 'POST',
                body: JSON.stringify({ code: data.cgp }),
                headers: { 'Content-Type': 'application/json' },
            });

            const result = await response.json();

            if (!response.ok) {
                setStatusError(result.message || "Código no válido");
            } else if (result.estado_label === 'Inactivo') {
                setStatusError("EL CÓDIGO YA HA SIDO UTILIZADO");
            } else {
                setStatusError(null); // Está activo
            }
        } catch (err) {
            setStatusError("Error de conexión con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (data.cgp !== '') checkCodeStatus();
    }, [data.cgp]);

    // 3. Función para autorizar (Botón)
    const handleAuthorize = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(route('verifycode'), {
                method: 'POST',
                body: JSON.stringify({ unit: data.asign, code: data.cgp, type: data.tytype }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al autorizar");
            }

            toast.success("Autorización completada.");
            setIsAuthorized(true);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8"
            >
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

                {isLoading ? (
                    <div className="flex flex-col items-center py-20">
                        <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
                        <p className="text-slate-400 animate-pulse text-sm">Validando credenciales...</p>
                    </div>
                ) : isAuthorized ? (
                    /* PANTALLA: ÉXITO TOTAL */
                    <SuccessView unit={data.unfg} />
                ) : statusError ? (
                    /* PANTALLA: CÓDIGO INACTIVO / ERROR */
                    <div className="text-center py-10 space-y-6">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border border-red-500/50">
                            <Lock size={40} className="text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Acceso Restringido</h2>
                            <p className="text-red-400 text-xs font-semibold mt-1 uppercase italic">{statusError}</p>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 text-left">
                            <p className="text-slate-500 text-[10px] uppercase font-bold mb-2 text-center">Detalles del intento</p>
                            <div className="flex justify-between text-xs font-mono"><span className="text-slate-500">Unidad:</span> <span className="text-slate-300">{data.unfg}</span></div>
                            <div className="flex justify-between text-xs font-mono"><span className="text-slate-500">Código:</span> <span className="text-slate-300">{data.cgp}</span></div>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">Por favor, solicite un nuevo código de autorización al departamento de tráfico.</p>
                    </div>
                ) : (
                    /* PANTALLA: FORMULARIO ACTIVO */
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2">Autorización de Salida</h2>
                            <p className="text-slate-400 text-sm">Confirme los detalles del despacho</p>
                        </div>

                        <div className="space-y-3">
                            <InfoRow icon={<Hash size={18} />} label="Asignación" value={data.asign} />
                            <InfoRow icon={<Truck size={18} />} label="Unidad" value={data.unfg} highlight />
                            <InfoRow icon={<User size={18} />} label="Operador" value={data.oprtd} />
                            <InfoRow icon={<MapPin size={18} />} label="Destino" value={data.dest} />
                        </div>

                        <motion.button
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAuthorize}
                            className="w-full py-4 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20"
                        >
                            <Send size={18} />
                            AUTORIZAR SALIDA
                        </motion.button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Componentes auxiliares
const SuccessView = ({ unit }) => (
    <AnimatePresence>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
            <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }}
                className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50"
            >
                <CheckCircle size={56} className="text-green-400" />
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2 italic">¡ÉXITO!</h2>
            <p className="text-slate-300">La unidad <strong className="text-white font-bold">{unit}</strong> ha sido autorizada correctamente.</p>
            <div className="h-1.5 bg-green-500 mt-10 rounded-full w-full" />
        </motion.div>
    </AnimatePresence>
);

const InfoRow = ({ icon, label, value, highlight }) => (
    <div className="flex items-center justify-between p-3.5 bg-slate-700/30 rounded-2xl border border-slate-600/50">
        <div className="flex items-center gap-3 text-slate-400">
            {icon}
            <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
        </div>
        <span className={`font-mono text-sm font-bold ${highlight ? 'text-blue-400' : 'text-slate-100'}`}>
            {value}
        </span>
    </div>
);

export default AuthorizationCard;