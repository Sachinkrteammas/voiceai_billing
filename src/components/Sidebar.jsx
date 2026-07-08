import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutGrid, Wallet, CreditCard, FileText, Settings, ChevronRight, Waves, LogOut } from 'lucide-react'
import { company } from '../data/mockData'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/wallet', label: 'Wallet', icon: Wallet },
  { to: '/recharge', label: 'Recharge', icon: CreditCard },
  { to: '/invoices', label: 'Invoices', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings }
]

export default function Sidebar() {
  const navigate = useNavigate()

  const signOut = () => {
    localStorage.removeItem('voiceai_authed')
    navigate('/login')
    window.location.reload()
  }

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 border-r border-ink-300/20 bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-ink-300/20">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
            <Waves size={17} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-[13.5px] font-semibold text-ink-900 leading-tight">VoiceAI</p>
            <p className="text-[11px] text-ink-400 leading-tight">Billing Portal</p>
          </div>
        </div>

{/*         <nav className="px-3 py-4 space-y-0.5"> */}
{/*           {navItems.map(({ to, label, icon: Icon, end }) => ( */}
{/*             <NavLink */}
{/*               key={to} */}
{/*               to={to} */}
{/*               end={end} */}
{/*               className={({ isActive }) => */}
{/*                 `group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${ */}
{/*                   isActive */}
{/*                     ? 'bg-brand-50 text-brand-600' */}
{/*                     : 'text-ink-500 hover:bg-ink-900/[0.03] hover:text-ink-900' */}
{/*                 }` */}
{/*               } */}
{/*             > */}
{/*               {({ isActive }) => ( */}
{/*                 <> */}
{/*                   <span className="flex items-center gap-2.5"> */}
{/*                     <Icon size={17} strokeWidth={2.1} /> */}
{/*                     {label} */}
{/*                   </span> */}
{/*                   {isActive && <ChevronRight size={14} className="text-brand-500" />} */}
{/*                 </> */}
{/*               )} */}
{/*             </NavLink> */}
{/*           ))} */}
{/*         </nav> */}

<nav className="px-3 py-4 space-y-0.5">
  {navItems.map(({ to, label, icon: Icon, end }) => {
    // Dashboard is clickable
    if (to === "/") {
      return (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors ${
              isActive
                ? 'bg-brand-50 text-brand-600'
                : 'text-ink-500 hover:bg-ink-900/[0.03] hover:text-ink-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="flex items-center gap-2.5">
                <Icon size={17} strokeWidth={2.1} />
                {label}
              </span>
              {isActive && <ChevronRight size={14} className="text-brand-500" />}
            </>
          )}
        </NavLink>
      );
    }

    // Other menus are read-only
    return (
      <div
        key={to}
        className="flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13.5px] font-medium text-ink-400 cursor-not-allowed opacity-60"
      >
        <span className="flex items-center gap-2.5">
          <Icon size={17} strokeWidth={2.1} />
          {label}
        </span>
      </div>
    );
  })}
</nav>
      </div>

      <div className="px-4 py-4 border-t border-ink-300/20">
        <p className="text-[13px] font-semibold text-ink-900 truncate">Sokudu</p>
{/*         <p className="text-[11px] text-ink-400 font-num mt-0.5 truncate">GSTIN: {company.gstin}</p> */}
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="text-[11px] text-ink-500">{company.plan}</span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-400 hover:text-danger mt-3 transition-colors"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
