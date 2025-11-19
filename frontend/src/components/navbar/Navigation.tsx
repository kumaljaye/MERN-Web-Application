'use client';

import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes.constant';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: ROUTES.HOME },
  { name: 'Products', href: ROUTES.PRODUCTS },
  { name: 'Users', href: ROUTES.USERS },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to={ROUTES.HOME} className="text-xl font-bold text-gray-900">
              React API Table
            </Link>
            <div className="hidden space-x-4 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
