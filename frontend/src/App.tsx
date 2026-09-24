import React, { useState } from 'react';
import { ComplejoProvider, useComplejo, type UserRole } from './context/ComplejoContext';
import LoginScreen from './screens/LoginScreen';
import LandingPage from './screens/LandingPage';
import MisReservas from './screens/MisReservas';
import ArbitroPanel from './screens/ArbitroPanel';
import AdminAgenda from './screens/AdminAgenda';
import AdminOverview from './screens/AdminOverview';
import AdminCanchas from './screens/AdminCanchas';
import AdminTorneo from './screens/AdminTorneo';
import AdminResultados from './screens/AdminResultados';
import AdminReportes from './screens/AdminReportes';
import AdminAuditoria from './screens/AdminAuditoria';
import AdminLayout from './screens/AdminLayout';
import ConfirmacionPagoModal, { type BookingSlotInfo } from './components/ConfirmacionPagoModal';
import InscripcionTorneoModal from './components/InscripcionTorneoModal';
import MisTorneos from './screens/MisTorneos';

export type ScreenId =
  | 'login'
  | 'landing'
  | 'mis-reservas'
  | 'mis-torneos'
  | 'arbitro'
  | 'admin-agenda'
  | 'admin-overview'
  | 'admin-canchas'
  | 'admin-torneo'
  | 'admin-resultados'
  | 'admin-reportes'
  | 'admin-auditoria';

const AppContent: React.FC = () => {
  const { userRole, setUserRole, bookCourt, resetDemoData, unreadNotifsCount } = useComplejo();
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('login');
  const [adminSection, setAdminSection] = useState<string>('agenda');
  const [isInscripcionOpen, setIsInscripcionOpen] = useState(false);
  const [isPagoOpen, setIsPagoOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlotInfo | null>(null);
  const [showDemoNav, setShowDemoNav] = useState(true);

  // Navigation Flows
  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'admin') {
      setCurrentScreen('admin-agenda');
      setAdminSection('agenda');
    } else if (role === 'arbitro') {
      setCurrentScreen('arbitro');
    } else {
      setCurrentScreen('landing');
    }
  };

  const handleAdminNavigate = (section: string) => {
    setAdminSection(section);
    if (section === 'agenda') setCurrentScreen('admin-agenda');
    else if (section === 'overview') setCurrentScreen('admin-overview');
    else if (section === 'canchas') setCurrentScreen('admin-canchas');
    else if (section === 'torneo') setCurrentScreen('admin-torneo');
    else if (section === 'resultados') setCurrentScreen('admin-resultados');
    else if (section === 'reportes') setCurrentScreen('admin-reportes');
    else if (section === 'auditoria') setCurrentScreen('admin-auditoria');
  };

  const handleOpenPago = (slotData: BookingSlotInfo) => {
    setSelectedSlot(slotData);
    setIsPagoOpen(true);
  };

  const handleConfirmPago = () => {
    if (selectedSlot) {
      bookCourt(
        selectedSlot.courtId || 'c1',
        selectedSlot.court,
        (selectedSlot.sport as any) || 'Fútbol 5',
        selectedSlot.date,
        selectedSlot.time
      );
    }
    setIsPagoOpen(false);
    setSelectedSlot(null);
    setCurrentScreen('mis-reservas');
  };

  const screensConfig: { id: ScreenId; label: string; role: string; tag?: string }[] = [
    { id: 'login', label: '1. Login', role: 'Todos', tag: 'RF-01' },
    { id: 'landing', label: '2. Landing & Canchas', role: 'Cliente', tag: 'RF-03' },
    { id: 'mis-reservas', label: '3. Mis Reservas & Perfil', role: 'Cliente', tag: 'RF-04, 12' },
    { id: 'mis-torneos', label: '4. Torneos & Posiciones', role: 'Cliente', tag: 'RF-07, 09, 11' },
    { id: 'arbitro', label: '5. Panel Árbitro', role: 'Árbitro', tag: 'RF-10, 19, 20' },
    { id: 'admin-agenda', label: '6. Agenda & Inasistencias', role: 'Admin', tag: 'RF-05, 06' },
    { id: 'admin-overview', label: '6. Dashboard Overview', role: 'Admin' },
    { id: 'admin-canchas', label: '7. ABM Canchas', role: 'Admin', tag: 'RF-02' },
    { id: 'admin-torneo', label: '8. Torneos & Fixture', role: 'Admin', tag: 'RF-07, 09' },
    { id: 'admin-resultados', label: '9. Carga Resultados', role: 'Admin', tag: 'RF-10, 11' },
    { id: 'admin-reportes', label: '10. Reportes', role: 'Admin', tag: 'RF-25' },
    { id: 'admin-auditoria', label: '11. Auditoría', role: 'Admin', tag: 'RF-26' }
  ];

  return (
    <div className="size-full min-h-screen bg-[#293827] flex flex-col font-['Inter',sans-serif]">
      {/* Top Demo Bar for quick preview and teacher grading */}
      {showDemoNav && (
        <header className="bg-[#141b13] border-b border-[#3b4d38] px-4 py-2 flex items-center justify-between gap-3 text-xs z-50 sticky top-0 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#65C556]">COMPLEJO UB</span>
            <span className="bg-[#293827] text-[#65c556] px-2 py-0.5 rounded border border-[#5a7056] font-mono text-[11px]">
              Prototipo Interactivo TP1
            </span>
            <span className="text-[#a0a0a0] hidden sm:inline flex items-center gap-1.5">
              Rol: <strong className="text-white capitalize">{userRole}</strong>
              {unreadNotifsCount > 0 && (
                <span className="bg-[#e53e3e] text-white px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {unreadNotifsCount} notif
                </span>
              )}
            </span>
          </div>

          {/* Quick Screen Switcher */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
            {screensConfig.map((s) => {
              const isActive = currentScreen === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setCurrentScreen(s.id);
                    if (s.id.startsWith('admin-')) {
                      setAdminSection(s.id.replace('admin-', ''));
                    }
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#65c556] text-[#293827] border-[#65c556] font-bold'
                      : 'bg-[#1e281d] text-[#c0c0c0] border-[#3b4d38] hover:border-[#65c556] hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                  {s.tag && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                        isActive ? 'bg-[#293827] text-[#65c556]' : 'bg-[#293827] text-[#888]'
                      }`}
                    >
                      {s.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={resetDemoData}
              title="Restablece las reservas y fixtures a los valores iniciales"
              className="bg-[#293827] hover:bg-[#3b4d38] text-[#c0c0c0] hover:text-white px-2 py-1 rounded text-[11px] border border-[#5a7056] cursor-pointer"
            >
              🔄 Reiniciar Datos Demo
            </button>

            {currentScreen !== 'login' && (
              <button
                type="button"
                onClick={() => setCurrentScreen('login')}
                className="bg-[#3d2424] hover:bg-[#c53030] text-[#ff8080] hover:text-white px-2.5 py-1 rounded font-semibold transition-colors border border-[rgba(229,62,62,0.3)] cursor-pointer text-[11px]"
              >
                Cerrar Sesión
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDemoNav(false)}
              className="text-[#a0a0a0] hover:text-white px-1.5 py-1 rounded bg-transparent border-none cursor-pointer"
              title="Ocultar barra demo (recarga para mostrar)"
            >
              ✕
            </button>
          </div>
        </header>
      )}

      {/* Main Screen Rendering */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}

        {currentScreen === 'landing' && (
          <LandingPage
            onNavigate={(screen) => setCurrentScreen(screen as ScreenId)}
            onOpenInscripcion={() => setIsInscripcionOpen(true)}
            onOpenPago={handleOpenPago}
          />
        )}

        {currentScreen === 'mis-reservas' && (
          <MisReservas onNavigate={(screen) => setCurrentScreen(screen as ScreenId)} />
        )}

        {currentScreen === 'mis-torneos' && (
          <MisTorneos
            onNavigate={(screen) => setCurrentScreen(screen as ScreenId)}
            onOpenInscripcion={() => setIsInscripcionOpen(true)}
          />
        )}

        {currentScreen === 'arbitro' && <ArbitroPanel />}

        {currentScreen === 'admin-agenda' && (
          <AdminLayout activeSection={adminSection} onNavigate={handleAdminNavigate}>
            <AdminAgenda />
          </AdminLayout>
        )}

        {currentScreen === 'admin-overview' && (
          <AdminLayout activeSection={adminSection} onNavigate={handleAdminNavigate}>
            <AdminOverview
              onNavigate={handleAdminNavigate}
              onOpenInscripcion={() => setIsInscripcionOpen(true)}
            />
          </AdminLayout>
        )}

        {currentScreen === 'admin-canchas' && (
          <AdminLayout activeSection={adminSection} onNavigate={handleAdminNavigate}>
            <AdminCanchas />
          </AdminLayout>
        )}

        {currentScreen === 'admin-torneo' && (
          <AdminLayout activeSection={adminSection} onNavigate={handleAdminNavigate}>
            <AdminTorneo onOpenInscripcion={() => setIsInscripcionOpen(true)} />
          </AdminLayout>
        )}

        {currentScreen === 'admin-resultados' && (
          <AdminLayout activeSection={adminSection} onNavigate={handleAdminNavigate}>
            <AdminResultados />
          </AdminLayout>
        )}

        {currentScreen === 'admin-reportes' && (
          <AdminLayout activeSection={adminSection} onNavigate={handleAdminNavigate}>
            <AdminReportes />
          </AdminLayout>
        )}

        {currentScreen === 'admin-auditoria' && (
          <AdminLayout activeSection={adminSection} onNavigate={handleAdminNavigate}>
            <AdminAuditoria />
          </AdminLayout>
        )}
      </main>

      {/* Global Modals */}
      <InscripcionTorneoModal
        isOpen={isInscripcionOpen}
        onClose={() => setIsInscripcionOpen(false)}
        onSubmit={() => {
          // Success handled in modal
        }}
      />

      <ConfirmacionPagoModal
        isOpen={isPagoOpen}
        slot={selectedSlot}
        onClose={() => {
          setIsPagoOpen(false);
          setSelectedSlot(null);
        }}
        onConfirm={handleConfirmPago}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ComplejoProvider>
      <AppContent />
    </ComplejoProvider>
  );
};

export default App;
