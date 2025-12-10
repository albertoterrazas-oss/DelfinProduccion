import React from 'react';
import { Flame } from 'lucide-react';
import logo from '../../../public/img/logo.png'; // 👈 Importamos axios para la llamada API directa
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="pt-[5px] px-[5px]">
      <div className="header">

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