// src/app/modules/absences/types/absence.ts

// Les états possibles d'une demande d'absence
export type AbsenceState =
  | 'brouillon'
  | 'soumise'
  | 'en_attente_approbation'
  | 'modifiee'
  | 'traitee'
  | 'en_attente_piece'
  | 'annulee'
  | 'refusee';


// Une demande d'absence complète
export interface AbsenceDemand {
  // Identifiant unique
  id: string;
  
  // Dates d'absence (format ISO 8601)
  startDate: string;        // Ex: "2025-11-06" ou "2025-11-06T09:15:00.000Z"
  endDate: string;          // Ex: "2025-11-08" ou "2025-11-08T14:30:00.000Z"
  
  // Métadonnées
  createdAt: string;        // Date de création
  createdBy: string;        // Qui a créé la demande
  
  // Informations employé
  employeeId: string;       // ID de l'employé
  jobCode: string;          // Code de l'emploi (ex: "3103")
  jobLabel?: string;        // Libellé de l'emploi (ex: "Primaire")
  workplaceCode: string;    // Code du lieu (ex: "515")
  workplaceLabel?: string;  // Libellé du lieu (ex: "École 515")
  
  // Motif
  reasonCode: string;       // Code du motif (ex: "maladie")
  reasonLabel?: string;     // Libellé du motif (ex: "Maladie")
  
  // État (utilise le type AbsenceState défini plus haut)
  state: AbsenceState;
  
  // Notes
  notes?: string;           // Note de l'employé (optionnel)
  approvalNotes?: string;   // Note d'approbation (optionnel)
  
  // Pièces jointes (optionnel)
  attachments?: Array<{
    id: string;
    name: string;
    url?: string;
  }>;
}


// Filtres pour rechercher des demandes
export interface AbsenceFilter {
  // Filtrage par période
  startDate?: string;            // Date de début minimum
  endDate?: string;              // Date de fin maximum
  
  // Filtrage par états (peut en sélectionner plusieurs)
  states?: AbsenceState[];
  
  // Filtrage par motifs (peut en sélectionner plusieurs)
  reasons?: string[];
  
  // Filtrage par initiateur
  createdBy?: string;
}

