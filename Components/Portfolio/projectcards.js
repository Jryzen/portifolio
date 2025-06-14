import React from "react";
import { ExternalLink, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectCard({ project, isAdmin, onEdit, onDelete }) {
  return (
    <div className="card-neon rounded-xl overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-white">
            {project.name}
          </h3>
          {isAdmin && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(project)}
                className="h-8 w-8 text-gray-400 hover:text-cyan-400 hover:bg-cyan-400/10"
              >
                <Settings className="w-4 h-4" />
              </Button>
               <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(project)}
                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {project.description && (
          <p className="text-gray-400 text-sm mb-5 leading-relaxed">
            {project.description}
          </p>
        )}

        <a
          href={project.access_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors group"
        >
          <span className="mr-2">Acessar Projeto</span>
          <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}