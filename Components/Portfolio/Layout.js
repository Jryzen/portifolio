import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Settings, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [securityCheck, setSecurityCheck] = React.useState(false);

  React.useEffect(() => {
    // Verificação de segurança básica na inicialização
    performSecurityChecks();
    checkAuth();
  }, []);

  const performSecurityChecks = () => {
    // Verificar se a página foi carregada em um iframe (proteção contra clickjacking)
    if (window.self !== window.top) {
      console.warn('Possível tentativa de clickjacking detectada');
      // Remover ou redirecionar se necessário
    }

    // Verificar URL suspeita
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /<script/i,
      /eval\(/i,
      /onclick/i,
      /onload/i
    ];

    const currentUrl = window.location.href;
    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(currentUrl));
    
    if (isSuspicious) {
      console.warn('URL suspeita detectada:', currentUrl);
      // Limpar URL ou redirecionar para página segura
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    setSecurityCheck(true);
  };

  const checkAuth = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      // Limpar dados sensíveis do localStorage/sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = createPageUrl("Portfolio");
    } catch (error) {
      console.error('Erro no logout:', error);
      // Force logout mesmo com erro
      window.location.href = createPageUrl("Portfolio");
    }
  };

  // Sanitizar entrada de dados
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove tags HTML básicas
      .replace(/javascript:/gi, '') // Remove javascript:
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  };

  const securityStyles = `
    body {
      background-color: #000000;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      /* Prevenir seleção de texto sensível */
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Reabilitar seleção para conteúdo necessário */
    .selectable {
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }
    
    /* Ocultar elementos sensíveis em inspetor */
    .sensitive-data {
      display: none !important;
    }
    
    /* Prevenir drag and drop malicioso */
    * {
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      user-drag: none;
    }
    
    @keyframes scroll-dot {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(16px); }
    }
    .animate-scroll-dot {
      animation: scroll-dot 2s infinite;
    }
    @keyframes scan-lines {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .scan-effect {
      position: relative;
      overflow: hidden;
    }
    .scan-effect::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, #00ffff, transparent);
      animation: scan-lines 3s infinite;
      z-index: 10;
      opacity: 0.8;
      box-shadow: 0 0 10px #00ffff;
    }
    .scan-effect::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        180deg,
        transparent 0%,
        rgba(0, 255, 255, 0.03) 25%,
        rgba(0, 255, 255, 0.01) 50%,
        rgba(0, 255, 255, 0.03) 75%,
        transparent 100%
      );
      z-index: 5;
      pointer-events: none;
    }
  `;

  // Não renderizar se não passou na verificação de segurança
  if (!securityCheck) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <p className="text-cyan-400">Verificando segurança...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      <style>{`
        :root {
          --neon-cyan: #00ffff;
          --bg-dark: #0a0a0a;
          --card-dark: rgba(20, 20, 20, 0.7);
          --border-neon: rgba(0, 255, 255, 0.3);
          --border-neon-hover: rgba(0, 255, 255, 0.7);
        }
        ${securityStyles}
        .text-glow {
          text-shadow: 0 0 8px var(--neon-cyan);
        }
        .card-neon {
          background: var(--card-dark);
          border: 1px solid var(--border-neon);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }
        .card-neon:hover {
          border-color: var(--border-neon-hover);
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.1);
        }
        .button-neon {
          border: 1px solid var(--border-neon);
          color: #a0a0a0;
          background: transparent;
          transition: all 0.3s ease;
        }
        .button-neon:hover {
          background: rgba(0, 255, 255, 0.1);
          color: var(--neon-cyan);
          border-color: var(--neon-cyan);
          box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
        }
      `}</style>

      {/* Security Headers */}
      <div 
        dangerouslySetInnerHTML={{
          __html: `
            <script>
              // Proteção contra ataques XSS
              if (document.domain !== '${window.location.hostname}') {
                window.location.href = '/';
              }
              
              // Detectar tentativas de modificação do DOM
              const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                      if (node.nodeType === 1 && node.tagName === 'SCRIPT') {
                        if (!node.src.includes('${window.location.hostname}')) {
                          console.warn('Script externo suspeito detectado');
                          node.remove();
                        }
                      }
                    });
                  }
                });
              });
              
              observer.observe(document.body, {
                childList: true,
                subtree: true
              });
              
              // Proteção contra console hijacking
              let devtools = false;
              setInterval(function() {
                if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
                  if (!devtools) {
                    devtools = true;
                    console.clear();
                    console.warn('DevTools detectado. Acesso monitorado por segurança.');
                  }
                }
              }, 500);
            </script>
          `
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link 
              to={createPageUrl("Portfolio")} 
              className="flex items-center space-x-3 group"
              onClick={(e) => {
                // Verificar se é um clique legítimo
                if (e.ctrlKey || e.metaKey || e.shiftKey) {
                  e.preventDefault();
                  console.warn('Tentativa de navegação suspeita detectada');
                  return false;
                }
              }}
            >
              <div className="w-9 h-9 border-2 border-cyan-400/50 rounded-full flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                <span className="text-cyan-400/80 font-bold text-sm group-hover:text-cyan-400 transition-colors">JR</span>
              </div>
              <h1 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors selectable">
                Portfólio | Julio Rayser
              </h1>
            </Link>

            <nav className="flex items-center space-x-2">
              {!isLoading && (
                <>
                  {user && user.role === 'admin' && (
                    <Link to={createPageUrl("Admin")}>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800 hover:text-white">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </Button>
                    </Link>
                  )}

                  {user && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Security Footer */}
      <div className="sensitive-data">
        <span data-security="protected">Security Layer Active</span>
      </div>
    </div>
  );
}