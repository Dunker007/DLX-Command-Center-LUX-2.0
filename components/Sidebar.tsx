import React from 'react';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, active, onClick }) => {
    const activeClasses = 'bg-cyan-500/20 border-l-4 border-cyan-400 text-white';
    const baseClasses = 'block text-cyan-400 hover:bg-cyan-500/20 hover:text-white py-3 px-6 transition-all duration-200 w-full text-left';
    return (
        <li>
            <a href={href} className={`${baseClasses} ${active ? activeClasses : 'border-l-4 border-transparent'}`} onClick={(e) => { e.preventDefault(); onClick(); }}>
                {children}
            </a>
        </li>
    );
};

interface SidebarProps {
    activeLink: string;
    setActiveLink: (link: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeLink, setActiveLink }) => {
    const links = ['Dashboard', 'AI Management', 'Task Management', 'Reports', 'Settings'];

    return (
        <aside className="fixed top-0 left-0 h-full w-60 bg-black/60 backdrop-blur-md pt-20 z-40 border-r border-cyan-500/30">
            <nav>
                <ul className="space-y-2">
                    {links.map(link => (
                        <NavLink 
                            key={link}
                            href="#" 
                            active={activeLink === link}
                            onClick={() => setActiveLink(link)}
                        >
                            {link}
                        </NavLink>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};