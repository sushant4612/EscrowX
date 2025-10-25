'use client';

import { useState, useEffect } from 'react';

type Role = 'client' | 'freelancer';

interface RoleSelectorProps {
    onRoleChange: (role: Role) => void;
}

export default function RoleSelector({ onRoleChange }: RoleSelectorProps) {
    const [selectedRole, setSelectedRole] = useState<Role>('client');

    useEffect(() => {
        const savedRole = localStorage.getItem('userRole') as Role;
        if (savedRole) {
            setSelectedRole(savedRole);
            onRoleChange(savedRole);
        }
    }, [onRoleChange]);

    const handleRoleChange = (role: Role) => {
        setSelectedRole(role);
        localStorage.setItem('userRole', role);
        onRoleChange(role);
    };

    return (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
            <button
                onClick={() => handleRoleChange('client')}
                className={`px-4 py-2 rounded-md font-medium transition ${selectedRole === 'client'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
            >
                Client
            </button>
            <button
                onClick={() => handleRoleChange('freelancer')}
                className={`px-4 py-2 rounded-md font-medium transition ${selectedRole === 'freelancer'
                        ? 'bg-green-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
            >
                Freelancer
            </button>
        </div>
    );
}
