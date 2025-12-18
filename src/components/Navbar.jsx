import { LogIn, LogOut, User, Activity, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenSettings, onOpenAuth }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass-panel" style={{
            margin: '1rem 2rem',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '1rem',
            zIndex: 50
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    background: 'var(--color-primary)',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    display: 'flex'
                }}>
                    <Activity color="white" size={24} />
                </div>
                <h1 style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
                    Medi<span style={{ color: 'var(--color-primary)' }}>Scan</span> AI
                </h1>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                            <User size={16} />
                            <span>{user.email.split('@')[0]}</span>
                        </div>
                        <button className="btn-outline" onClick={logout} title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <button className="btn-primary" onClick={onOpenAuth} style={{ padding: '0.5rem 1.25rem' }}>
                        <LogIn size={18} />
                        <span style={{ marginLeft: '0.5rem' }}>Login</span>
                    </button>
                )}

                <button
                    className="btn-outline"
                    onClick={onOpenSettings}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                >
                    <Settings size={18} />
                    <span>Config</span>
                </button>
            </div>
        </nav>
    );
};


export default Navbar;
