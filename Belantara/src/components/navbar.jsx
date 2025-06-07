import { Settings, Ticket, LayoutDashboard, Menu, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import belantaraImage from '../assets/belantara.png';
import api from '../api/axiosInstance';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };
  const handleLogout = async () => {
  try {
    await api.post('/user/logout', {}, {
      withCredentials: true,
    });

    localStorage.removeItem('accessToken');

    navigate('/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};


  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:relative
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        transition-transform duration-300 ease-in-out
        w-64 md:w-48 h-full bg-white shadow-lg
        z-40 flex flex-col
        overflow-y-auto
      `}>
        {/* Logo */}
        <div className="flex-none p-4 pt-16 md:pt-4 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-green-500 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img src={belantaraImage} alt="Belantara Foundation" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-grow overflow-y-auto px-2">
          <div className="mt-6 space-y-1">
            {/* Dashboard */}
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/admin/dashboard'
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => goTo('/admin/dashboard')}
            >
              <LayoutDashboard size={18} className="mr-3" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Tickets */}
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/admin/tickets'
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => goTo('/admin/tickets')}
            >
              <Ticket size={18} className="mr-3" />
              <span className="font-medium">Tickets</span>
            </button>

            {/* Settings */}
            <button
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === '/admin/settings'
                  ? 'bg-gray-100 text-black'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => goTo('/admin/settings')}
            >
              <Settings size={18} className="mr-3" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Footer with social media and logout */}
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              type="button"
              className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-100 transition-colors"
              aria-label="Facebook"
              onClick={() => window.open('https://www.facebook.com/BelantaraFoundation/', '_blank', 'noopener,noreferrer')}
            >
              <FontAwesomeIcon icon={faFacebook} size="lg" className="text-blue-600" />
            </button>

            <button
              type="button"
              className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-50 transition-colors"
              aria-label="Twitter"
              onClick={() => window.open('https://x.com/belantara', '_blank', 'noopener,noreferrer')}
            >
              <FontAwesomeIcon icon={faTwitter} size="lg" className="text-blue-400" />
            </button>

            <button
              type="button"
              className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-blue-50 transition-colors"
              aria-label="LinkedIn"
              onClick={() => window.open('https://www.linkedin.com/company/belantara-foundation/about/', '_blank', 'noopener,noreferrer')}
            >
              <FontAwesomeIcon icon={faLinkedin} size="lg" className="text-blue-800" />
            </button>

            <button
                type="button"
                className="aspect-square rounded-full border border-gray-300 flex items-center justify-center hover:bg-pink-50 transition-colors"
                aria-label="Instagram"
                onClick={() => window.open('https://www.instagram.com/belantara_found/', '_blank', 'noopener,noreferrer')}
                >
                <FontAwesomeIcon icon={faInstagram} size="lg" className="text-pink-600" />
            </button>


          </div>

          <button
            className="text-white font-medium px-4 py-2 rounded-lg w-full transition-colors hover:bg-red-700"
            style={{ backgroundColor: '#dc2626' }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;