import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ProjectForm({ project, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    access_link: project?.access_link || "",
    category: project?.category || "systems",
    description: project?.description || "",
    highlight_tag: project?.highlight_tag || "",
    resources: project?.resources || [],
    is_active: project?.is_active !== false
  });

  const [securityWarnings, setSecurityWarnings] = useState([]);

  // Função para sanitizar entrada
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/javascript:/gi, '') // Remove javascript:
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .replace(/[<>]/g, '') // Remove tags básicas
      .trim();
  };

  // Validação de URL segura
  const validateURL = (url) => {
    const warnings = [];
    
    try {
      const urlObj = new URL(url);
      
      // Verificar protocolos seguros
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        warnings.push('URL deve usar protocolo HTTP ou HTTPS');
      }
      
      // Verificar domínios suspeitos
      const suspiciousDomains = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
 