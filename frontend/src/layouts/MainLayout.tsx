import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  { to: '/dashboard',    label: 'Dashboard'     },
  { to: '/metricas',     label: 'Metricas'      },
  { to: '/optimizacion', label: 'Optimizacion'  },
  { to: '/comentarios',  label: 'Comentarios'   },
  { to: '/analisis-nlp', label: 'Analisis NLP'  },
  { to: '/clientes',     label: 'Clientes'      },
  { to: '/reportes',     label: 'Reportes'      },
];

export default function MainLayout() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <header style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '52px' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em' }}>
            Centro Inteligente de Atencion
          </span>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  color: isActive ? '#ffffff' : '#94a3b8',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 600 : 400,
                  borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
                  paddingBottom: '2px',
                })}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <Outlet />
      </main>

      <footer style={{ borderTop: '1px solid #e2e8f0', padding: '1rem 2rem', textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '3rem' }}>
        SciPy + NLTK — Produccion Web Empresarial
      </footer>
    </div>
  );
}
