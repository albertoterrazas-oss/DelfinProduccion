import React from 'react';
import { Flame } from 'lucide-react';
import logo from '../../../public/img/logo.png'; // 👈 Importamos axios para la llamada API directa
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">

        <div className="flex items-center space-x-3">
          
        </div>

        <div className="flex flex-col items-end">
          <Link to={'/dashboard'} className="w-full">
            <img
              src={logo}
              alt="Logo delfin"
              className="h-6 sm:h-8"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}