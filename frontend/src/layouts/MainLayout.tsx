import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/metricas', label: 'Metricas' },
  { to: '/optimizacion', label: 'Optimizacion' },
  { to: '/comentarios', label: 'Comentarios' },
  { to: '/analisis-nlp', label: 'Analisis NLP' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/reportes', label: 'Reportes' },
];

export default function MainLayout() {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('modoTema') !== 'light';
  });

  // =====================================================
  // CAMBIO GLOBAL DEL TEMA
  // =====================================================

  useEffect(() => {
    localStorage.setItem(
      'modoTema',
      darkMode ? 'dark' : 'light'
    );

    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = darkMode
      ? '#1B0430'
      : '#FCF3FA';

    document.documentElement.style.backgroundColor = darkMode
      ? '#1B0430'
      : '#FCF3FA';

  }, [darkMode]);

  const cambiarTema = () => {
    setDarkMode(prev => !prev);
  };

  // =====================================================
  // PALETA DE COLORES
  // =====================================================

  const tema = darkMode
    ? {
      // 🌙 MODO NOCHE — degradado morado → rosa

      bg: '#1B0430',
      bgGradient: 'radial-gradient(circle at 50% 110%, rgba(171,73,204,0.30) 0%, #1B0430 65%)',
      text: '#FFFFFF',
      secondary: '#E7B8E8',
      headerBg: 'rgba(27,4,48,0.96)',
      headerBorder: '#5C1A7A',
      cardBg: '#2A0845',
      cardBorder: '#5C1A7A',
      buttonBg: '#AB49CC',
      buttonText: '#FFFFFF',
      buttonBorder: '#FF7CBC',
      accent: '#FF7CBC',
      primary: '#AB49CC',
      secondaryBlue: '#FF69B4',
      footerBorder: '#5C1A7A',
      mutedSurface: 'rgba(255,255,255,0.045)',
      successText: '#4ADE80',
      successBg: 'rgba(74,222,128,0.12)',
      successBorder: 'rgba(74,222,128,0.35)',
      dangerText: '#F87171',
      dangerBg: 'rgba(248,113,113,0.12)',
      dangerBorder: 'rgba(248,113,113,0.35)',
    }

    : {
      // ☀️ MODO DÍA — degradado morado → rosa

      bg: '#FCF3FA',
      bgGradient: 'radial-gradient(circle at 50% 110%, rgba(255,124,188,0.28) 0%, #FCF3FA 65%)',
      text: '#4B0A66',
      secondary: '#8E22BB',
      headerBg: 'rgba(255,255,255,0.96)',
      headerBorder: '#F3C9E3',
      cardBg: '#FFFFFF',
      cardBorder: '#F0D6ED',
      buttonBg: '#8E22BB',
      buttonText: '#FFFFFF',
      buttonBorder: '#FF7CBC',
      accent: '#FF7CBC',
      primary: '#8E22BB',
      secondaryBlue: '#FF69B4',
      footerBorder: '#F0D6ED',
      mutedSurface: '#FBEAF6',
      successText: '#166534',
      successBg: '#F0FDF4',
      successBorder: '#BBF7D0',
      dangerText: '#DC2626',
      dangerBg: '#FEF2F2',
      dangerBorder: '#FECACA',
    };

  return (
    <div
      style={{
        fontFamily:'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: tema.bg,
        backgroundImage: tema.bgGradient,
        color: tema.text,

        // =================================================
        // VARIABLES GLOBALES
        // =================================================

        '--text-primary': tema.text,

        '--text-secondary': tema.secondary,

        '--primary': tema.primary,

        '--secondary-blue': tema.secondaryBlue,

        '--card-bg': tema.cardBg,

        '--border-color': tema.cardBorder,

        '--accent': tema.accent,

        '--button-bg': tema.buttonBg,

        '--button-text': tema.buttonText,

        '--surface-muted': tema.mutedSurface,

        '--success': tema.successText,
        '--success-bg': tema.successBg,
        '--success-border': tema.successBorder,

        '--danger': tema.dangerText,
        '--danger-bg': tema.dangerBg,
        '--danger-border': tema.dangerBorder,

        '--card-shadow': darkMode
          ? '0 10px 30px rgba(0,0,0,0.30)'
          : '0 8px 25px rgba(17,76,95,0.10)',
        margin: 0,
        padding: 0,
        transition:
          'background-color 0.3s ease, color 0.3s ease',
      } as React.CSSProperties}
    >

      {/* =================================================
          HEADER
          ================================================= */}

      <header
        style={{
          width: '100%',
          boxSizing: 'border-box',
          backgroundColor: tema.headerBg,
          borderBottom:`1px solid ${tema.headerBorder}`,
          backdropFilter: 'blur(12px)',
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 2,
        }}
      >

        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '64px',
            padding: '0 1.5rem',
            boxSizing: 'border-box',
          }}
        >

          {/* =================================================
              LOGO
              ================================================= */}

          <span
            style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.04em',
              color: tema.text,
              whiteSpace: 'nowrap',
            }}
          >
            CENTRO INTELIGENTE DE ATENCIÓN
          </span>

          {/* =================================================
              NAVEGACIÓN
              ================================================= */}

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >

            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  color: tema.text,
                  opacity: isActive ? 1 : 0.55,
                  textDecoration: 'none',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  borderBottom: isActive
                    ? `2px solid ${tema.primary}`
                    : '2px solid transparent',
                  paddingBottom: '5px',
                  transition: 'all 0.2s ease',
                })}
              >
                {item.label}
              </NavLink>
            ))}

            {/* =================================================
                BOTÓN DÍA / NOCHE
                ================================================= */}

            <button
              onClick={cambiarTema}
              title={
                darkMode
                  ? 'Cambiar a modo día'
                  : 'Cambiar a modo noche'
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.8rem',
                borderRadius: '999px',
                border:
                  `1px solid ${tema.buttonBorder}`,
                backgroundColor:tema.buttonBg,
                color:tema.buttonText,
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow:
                  darkMode
                    ? '0 4px 12px rgba(0,0,0,0.25)'
                    : '0 3px 10px rgba(17,76,95,0.12)',
                transition:'all 0.3s ease',
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </nav>
        </div>
      </header>

      {/* =================================================
          FRANJA DE ONDA — identidad visual de "flujo de datos"
          Se repite en todas las páginas porque vive en el layout.
          ================================================= */}

      <div
        style={{
          width: '100%',
          height: '90px',
          overflow: 'hidden',
          position: 'relative',
          lineHeight: 0,
          backgroundColor: tema.bg,
        }}
      >
        <svg
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <defs>
            <linearGradient id="ondaGradiente" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={tema.primary} stopOpacity={darkMode ? 0.9 : 0.85} />
              <stop offset="55%" stopColor={tema.secondaryBlue} stopOpacity={darkMode ? 0.75 : 0.6} />
              <stop offset="100%" stopColor={tema.primary} stopOpacity={darkMode ? 0.35 : 0.25} />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C240,140 420,0 720,60 C1020,120 1200,20 1440,70 L1440,0 L0,0 Z"
            fill="url(#ondaGradiente)"
          />
          <circle cx="120" cy="40" r="6" fill={tema.secondaryBlue} opacity={0.5} />
          <circle cx="980" cy="30" r="9" fill={tema.primary} opacity={0.4} />
          <circle cx="1330" cy="55" r="5" fill={tema.secondaryBlue} opacity={0.45} />
        </svg>
      </div>

      {/* =================================================
          CONTENIDO
          ================================================= */}

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          boxSizing: 'border-box',
        }}
      >
        <Outlet />
      </main>

      {/* =================================================
          FOOTER
          ================================================= */}

      <footer
        style={{
          borderTop:`1px solid ${tema.footerBorder}`,
          padding: '1rem 2rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: tema.secondary,
          marginTop: '3rem',
          transition: 'all 0.3s ease',
        }}
      >
        SciPy + NLTK — Produccion Web Empresarial
      </footer>

    </div>
  );
}