import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, User, MapPin, Send } from 'lucide-react';

const AuthorizationCard = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handleAuthorize = () => {
    setIsAuthorized(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8"
      >
        {/* Decoración de fondo */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        
        {!isAuthorized ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Autorización de Salida</h2>
              <p className="text-slate-400 text-sm">Confirme los detalles del despacho</p>
            </div>

            <div className="space-y-4">
              <InfoRow icon={<Truck size={18}/>} label="Unidad" value="UNIDAD - 003" highlight />
              <InfoRow icon={<User size={18}/>} label="Operador" value="Juan Pérez López" />
              <InfoRow icon={<MapPin size={18}/>} label="Destino" value="Planta Central - Sector B" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAuthorize}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
            >
              <Send size={18} />
              AUTORIZAR SALIDA
            </motion.button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50"
              >
                <CheckCircle size={48} className="text-green-400" />
              </motion.div>
              
              <h2 className="text-3xl font-black text-white mb-2 italic">¡ÉXITO!</h2>
              <p className="text-slate-300">La <strong>Unidad - 003</strong> ha sido autorizada correctamente.</p>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                className="h-1 bg-green-500 mt-8 rounded-full"
              />
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </div>
  );
};

const InfoRow = ({ icon, label, value, highlight }) => (
  <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-2xl border border-slate-600/50">
    <div className="flex items-center gap-3 text-slate-400">
      {icon}
      <span className="text-xs uppercase tracking-wider font-semibold">{label}</span>
    </div>
    <span className={`font-mono font-bold ${highlight ? 'text-blue-400' : 'text-slate-100'}`}>
      {value}
    </span>
  </div>
);

export default AuthorizationCard;