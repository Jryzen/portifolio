import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Save, Upload, Camera } from "lucide-react";
import { UploadFile } from "@/integrations/Core";

export default function ProfileForm({ user, onSave, isLoading }) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    title: user?.title || "",
    about: user?.about || "",
    profile_image_url: user?.profile_image_url || "",
    education_technical: user?.education_technical || "",
    education_graduation: user?.education_graduation || "",
    education_post_graduation: user?.education_post_graduation || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
    email: user?.email || "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleInputChange("profile_image_url", file_url);
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <Card className="bg-gray-900/80 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <User /> Informações do Perfil
        </CardTitle>
        <CardDescription className="text-gray-400">
          Atualize os dados que aparecem na página principal do portfólio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Section */}
          <div className="space-y-4">
            <Label>Foto de Perfil</Label>
            <div className="flex items-center gap-4">
              {formData.profile_image_url && (
                <img
                  src={formData.profile_image_url}
                  alt="Foto de perfil"
                  className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400/50"
                />
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload').click()}
                  disabled={uploadingImage}
                  className="border-cyan-600 text-cyan-400 hover:bg-cyan-600/10"
                >
                  {uploadingImage ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400 mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Alterar Foto
                    </>
                  )}
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
            <Input
              placeholder="Ou cole a URL da imagem"
              value={formData.profile_image_url}
              onChange={(e) => handleInputChange("profile_image_url", e.target.value)}
              className="bg-gray-800 border-gray-600"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nome Completo</Label>
              <Input 
                id="full_name" 
                value={formData.full_name} 
                onChange={(e) => handleInputChange("full_name", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Título Profissional</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => handleInputChange("title", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">Sobre</Label>
            <Textarea 
              id="about" 
              value={formData.about} 
              onChange={(e) => handleInputChange("about", e.target.value)} 
              className="bg-gray-800 border-gray-600 h-24"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="education_technical">Formação Técnica</Label>
              <Input 
                id="education_technical" 
                value={formData.education_technical} 
                onChange={(e) => handleInputChange("education_technical", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="education_graduation">Graduação</Label>
              <Input 
                id="education_graduation" 
                value={formData.education_graduation} 
                onChange={(e) => handleInputChange("education_graduation", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="education_post_graduation">Pós-Graduação</Label>
              <Input 
                id="education_post_graduation" 
                value={formData.education_post_graduation} 
                onChange={(e) => handleInputChange("education_post_graduation", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">URL LinkedIn</Label>
              <Input 
                id="linkedin_url" 
                value={formData.linkedin_url} 
                onChange={(e) => handleInputChange("linkedin_url", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="github_url">URL GitHub</Label>
              <Input 
                id="github_url" 
                value={formData.github_url} 
                onChange={(e) => handleInputChange("github_url", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">Email de Contato</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleInputChange("email", e.target.value)} 
                className="bg-gray-800 border-gray-600"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar Informações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}