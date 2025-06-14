
import React, { useState, useEffect } from "react";
import { Project } from "@/entities/Project";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Loader2, Settings, Trash2, LayoutDashboard, BrainCircuit, AppWindow } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProjectForm from "../components/admin/ProjectForm";
import ProfileForm from "../components/admin/ProfileForm";

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  const checkAuthAndLoadData = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      if (currentUser.role !== 'admin') {
        setMessage({ type: 'error', text: 'Acesso negado. Privilégios de administrador necessários.' });
        setIsLoading(false);
        return;
      }

      await loadProjects();
    } catch (error) {
      if (error.message.includes('not authenticated')) {
        await User.login();
      } else {
        setMessage({ type: 'error', text: 'Falha ao carregar dados. Por favor, tente novamente.' });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadProjects = async () => {
     const projectsData = await Project.list('-created_date');
     setProjects(projectsData);
  }

  const handleLogin = async () => {
    await User.login();
  };

  const handleSaveProject = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingProject) {
        await Project.update(editingProject.id, formData);
        setMessage({ type: 'success', text: 'Projeto atualizado com sucesso!' });
      } else {
        await Project.create(formData);
        setMessage({ type: 'success', text: 'Projeto adicionado com sucesso!' });
      }
      
      await loadProjects();
      setShowForm(false);
      setEditingProject(null);
    } catch (error) {
      setMessage({ type: 'error', text: 'Falha ao salvar projeto. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSaveProfile = async (formData) => {
    setIsSubmitting(true);
    try {
      await User.updateMyUserData(formData);
      const updatedUser = await User.me();
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch(e) {
      setMessage({ type: 'error', text: 'Falha ao atualizar perfil.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (project) => {
    if (!confirm(`Tem certeza que deseja deletar "${project.name}"?`)) return;
    
    try {
      await Project.delete(project.id);
      await loadProjects();
      setMessage({ type: 'success', text: 'Projeto deletado com sucesso!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Falha ao deletar projeto. Por favor, tente novamente.' });
    }
  };

  const AdminProjectCard = ({ project, category }) => (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400/40 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-white font-medium">{project.name}</h4>
          <p className="text-gray-400 text-sm">{category}</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(project)}
            className="h-8 w-8 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(project)}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {project.description && (
        <p className="text-gray-300 text-sm mb-3">{project.description}</p>
      )}
      <a
        href={project.access_link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 hover:text-cyan-300 text-sm"
      >
        Ver Projeto
      </a>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-gray-400">Carregando painel de administração...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card-neon max-w-md w-full mx-auto rounded-2xl p-8 text-center">
          <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Acesso de Administrador</h1>
          <p className="text-gray-400 mb-8">
            Faça login para acessar o painel de administração.
          </p>
          <Button 
            onClick={handleLogin}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Entrar com Google
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md bg-red-900/50 border-red-500 text-red-300">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Privilégios de administrador são necessários para acessar esta página.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowForm(false);
            setEditingProject(null);
          }}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  const dashboardsProjects = projects.filter(p => p.category === 'dashboards');
  const systemsProjects = projects.filter(p => p.category === 'systems');
  const applicationsProjects = projects.filter(p => p.category === 'applications');

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Painel de Administração</h1>
      
      {message && (
        <Alert className={`mb-8 ${message.type === 'error' ? 'bg-red-900/50 border-red-500 text-red-300' : 'bg-green-900/50 border-green-500 text-green-300'}`}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      
      <div className="mb-12">
        <ProfileForm user={user} onSave={handleSaveProfile} isLoading={isSubmitting} />
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Gerenciar Projetos</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Projeto
        </Button>
      </div>
      
      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <LayoutDashboard className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-gray-300">Dashboards ({dashboardsProjects.length})</h3>
          </div>
          {dashboardsProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardsProjects.map((project) => (
                <AdminProjectCard key={project.id} project={project} category="Dashboard" />
              ))}
            </div>
          ) : <div className="card-neon text-center py-8 text-gray-500 rounded-lg"><p>Nenhum dashboard cadastrado.</p></div>}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-gray-300">Sistemas ({systemsProjects.length})</h3>
          </div>
          {systemsProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemsProjects.map((project) => (
                <AdminProjectCard key={project.id} project={project} category="Sistema" />
              ))}
            </div>
          ) : <div className="card-neon text-center py-8 text-gray-500 rounded-lg"><p>Nenhum sistema cadastrado.</p></div>}
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <AppWindow className="w-6 h-6 text-cyan-400" />
            <h3 className="text-2xl font-bold text-gray-300">Aplicações ({applicationsProjects.length})</h3>
          </div>
          {applicationsProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applicationsProjects.map((project) => (
                <AdminProjectCard key={project.id} project={project} category="Aplicação" />
              ))}
            </div>
          ) : <div className="card-neon text-center py-8 text-gray-500 rounded-lg"><p>Nenhuma aplicação cadastrada.</p></div>}
        </section>
      </div>
    </div>
  );
}
