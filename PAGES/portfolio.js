import React, { useState, useEffect, useRef } from "react";
import { Project } from "@/entities/Project";
import { User } from "@/entities/User";
import { Mail, Github, Linkedin, GraduationCap, UserCircle, ExternalLink, Download, LayoutDashboard, BrainCircuit, AppWindow } from "lucide-react";

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const firstSectionRef = useRef(null);

  const defaultOwner = {
    full_name: "Julio Rayser",
    title: "Arquiteto de Sistemas & Engenheiro de Machine Learning",
    profile_image_url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/b340b7fef_Retratosofisticadoempretoebranco.png",
    about: "Profissional inovador e detalhista com mais de 10 anos de experiência no design, desenvolvimento e implantação de sistemas de alta performance e soluções baseadas em dados.",
    education_technical: "Tecnologia da Informação",
    education_graduation: "Análise e Desenvolvimento de Sistemas",
    education_post_graduation: "Engenharia de Machine Learning",
    linkedin_url: "https://linkedin.com/in/jryzen",
    github_url: "https://github.com/jryzen",
    email: "elematechdigital@gmail.com"
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const projectsData = await Project.filter({ is_active: true }, 'name');
      setProjects(projectsData);

      const users = await User.filter({ role: 'admin' }, '-created_date', 1);
      if (users.length > 0) {
        setOwner({ ...defaultOwner, ...users[0] });
      } else {
        setOwner(defaultOwner);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setOwner(defaultOwner);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScrollDown = () => {
    firstSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const ProjectCard = ({ project, icon, categoryTitle }) => (
    <a
      href={project.access_link}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card bg-gray-900/60 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-400/40 transition-all duration-300 group cursor-pointer block"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg group-hover:text-cyan-400 transition-colors">{project.name}</h3>
            <p className="text-gray-400 text-sm">{categoryTitle}</p>
          </div>
        </div>
        {project.highlight_tag && (
          <span className="bg-cyan-400/20 text-cyan-400 px-2 py-1 rounded text-xs font-medium border border-cyan-400/30">
            {project.highlight_tag}
          </span>
        )}
      </div>

      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
        {project.description}
      </p>

      {project.resources && project.resources.length > 0 && (
        <div className="mb-4">
          <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider">
            RECURSOS DISPONÍVEIS ({project.resources.length})
          </p>
          <div className="space-y-1">
            {project.resources.map((resource, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Download className="w-3 h-3 text-gray-500" />
                <span className="text-gray-400">{resource.name}</span>
                <span className="text-gray-500 text-xs">{resource.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="inline-flex items-center text-cyan-400 group-hover:text-cyan-300 font-medium text-sm transition-colors group-hover:translate-x-1 transform duration-200">
        <ExternalLink className="w-4 h-4 mr-2" />
        Acessar Projeto
      </div>
    </a>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const systemsProjects = projects.filter(p => p.category === 'systems');
  const applicationsProjects = projects.filter(p => p.category === 'applications');
  const dashboardsProjects = projects.filter(p => p.category === 'dashboards');

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="scan-effect w-32 h-32 rounded-full mx-auto mb-6 ring-2 ring-cyan-400/50 shadow-[0_0_25px_rgba(0,255,255,0.3)] overflow-hidden">
          <img
            src={owner.profile_image_url}
            alt="Julio Rayser"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
          {owner.full_name}
        </h1>
        <p className="text-xl text-cyan-400 text-glow font-medium mb-12">
          {owner.title}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12 text-left">
          {/* Education Card */}
          <div className="card-neon p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2"/>
              Formação Acadêmica
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-bold text-white">Técnico</p>
                <p className="text-gray-400">{owner.education_technical}</p>
              </div>
              <div>
                <p className="font-bold text-white">Graduação</p>
                <p className="text-gray-400">{owner.education_graduation}</p>
              </div>
              <div>
                <p className="font-bold text-white">Pós-Graduação</p>
                <p className="text-gray-400">{owner.education_post_graduation}</p>
              </div>
            </div>
          </div>
          {/* About Card */}
          <div className="card-neon p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-cyan-400 mb-4 flex items-center">
              <UserCircle className="w-5 h-5 mr-2"/>
              Sobre
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm">{owner.about}</p>
          </div>
        </div>

        <div className="flex justify-center items-center space-x-4">
          <a href={owner.linkedin_url} target="_blank" rel="noopener noreferrer" className="button-neon px-4 py-2 rounded-lg flex items-center space-x-2">
            <Linkedin className="w-4 h-4"/> <span>LinkedIn</span>
          </a>
          <a href={owner.github_url} target="_blank" rel="noopener noreferrer" className="button-neon px-4 py-2 rounded-lg flex items-center space-x-2">
            <Github className="w-4 h-4"/> <span>GitHub</span>
          </a>
          <a href={`mailto:${owner.email}`} className="button-neon px-4 py-2 rounded-lg flex items-center space-x-2">
            <Mail className="w-4 h-4"/> <span>Email</span>
          </a>
        </div>
        
        <div className="mt-16 text-center">
            <button
                onClick={handleScrollDown}
                className="text-cyan-400/70 hover:text-cyan-400 transition-colors"
                aria-label="Rolar para baixo"
            >
                <div className="w-6 h-10 border-2 border-cyan-400/80 rounded-full flex justify-center items-start pt-2 animate-pulse">
                    <div className="w-1 h-2 bg-cyan-400 rounded-full animate-scroll-dot"></div>
                </div>
            </button>
        </div>
      </div>

      {/* Projects Sections */}
      <div className="space-y-16">
        {/* Dashboards Section */}
        <section ref={firstSectionRef}>
          <div className="flex items-center gap-4 mb-8">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Dashboards</h2>
          </div>
          {dashboardsProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardsProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  categoryTitle="Dashboard"
                  icon={<LayoutDashboard className="w-full h-full" />}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum dashboard disponível.</p>
          )}
        </section>

        {/* Systems Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <BrainCircuit className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Sistemas</h2>
          </div>
          {systemsProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemsProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  categoryTitle="Sistema"
                  icon={<BrainCircuit className="w-full h-full" />}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhum sistema disponível.</p>
          )}
        </section>

        {/* Applications Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <AppWindow className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">Aplicações</h2>
          </div>
          {applicationsProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicationsProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  categoryTitle="Aplicação"
                  icon={<AppWindow className="w-full h-full" />}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">Nenhuma aplicação disponível.</p>
          )}
        </section>
      </div>
    </div>
  );
}