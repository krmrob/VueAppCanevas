// src/app/modules/absences/services/absenceService.ts
import type {
  AbsenceDemand,
  AbsenceFilter,
  AbsenceState,
} from '../types/absence';


// Données mockées (exemples de demandes d'absence)
const mockDemands: AbsenceDemand[] = [
  {
    id: '1',
    startDate: '2025-11-06T09:15:00.000Z',
    endDate: '2025-11-08T09:15:00.000Z',
    createdAt: '2025-09-30T09:15:00.000Z',
    createdBy: 'Marie Tremblay',
    employeeId: '0000006',
    jobCode: '3103',
    jobLabel: 'Primaire',
    workplaceCode: '515',
    workplaceLabel: 'École 515',
    reasonCode: 'maladie',
    reasonLabel: 'Maladie',
    state: 'annulee',
    notes: 'Suivi médical (pour un proche).',
    approvalNotes: "Requête initiée par l'employé",
  },
  {
    id: '2',
    startDate: '2025-11-10T09:15:00.000Z',
    endDate: '2025-11-12T09:15:00.000Z',
    createdAt: '2025-09-30T09:15:00.000Z',
    createdBy: 'Pierre Lefebvre',
    employeeId: '0000007',
    jobCode: '2104',
    jobLabel: 'Conseiller pédagogique',
    workplaceCode: '515',
    workplaceLabel: 'École 515',
    reasonCode: 'vacances',
    reasonLabel: 'Vacances',
    state: 'refusee',
    notes: 'Besoin de repos après un déplacement',
    approvalNotes: 'En attente de pièces justificatives',
  },
  {
    id: '3',
    startDate: '2025-10-06T09:15:00.000Z',
    endDate: '2025-10-08T09:15:00.000Z',
    createdAt: '2025-09-30T09:15:00.000Z',
    createdBy: 'Sophie Bergeron',
    employeeId: '0000001',
    jobCode: '3201',
    jobLabel: 'Suppléant',
    workplaceCode: '515',
    workplaceLabel: 'École 515',
    reasonCode: 'force_majeure',
    reasonLabel: 'Force majeure',
    state: 'brouillon',
    notes: 'Besoin de repos après un déplacement',
  },
  {
    id: '4',
    startDate: '2025-11-06T09:15:00.000Z',
    endDate: '2025-11-08T09:15:00.000Z',
    createdAt: '2025-10-30T09:15:00.000Z',
    createdBy: 'Sophie Bergeron',
    employeeId: '0000001',
    jobCode: '3201',
    jobLabel: 'Suppléant',
    workplaceCode: '515',
    workplaceLabel: 'École 515',
    reasonCode: 'force_majeure',
    reasonLabel: 'Force majeure',
    state: 'brouillon',
    notes: 'Besoin de repos après un déplacement',
  },
  {
    id: '5',
    startDate: '2025-12-06T09:15:00.000Z',
    endDate: '2025-12-08T09:15:00.000Z',
    createdAt: '2025-11-30T09:15:00.000Z',
    createdBy: 'Sophie Bergeron',
    employeeId: '0000001',
    jobCode: '3201',
    jobLabel: 'Suppléant',
    workplaceCode: '515',
    workplaceLabel: 'École 515',
    reasonCode: 'force_majeure',
    reasonLabel: 'Force majeure',
    state: 'brouillon',
    notes: 'Besoin de repos après un déplacement',
  },
  {
    id: '6',
    startDate: '2025-09-06T09:15:00.000Z',
    endDate: '2025-09-08T09:15:00.000Z',
    createdAt: '2025-08-30T09:15:00.000Z',
    createdBy: 'Sophie Bergeron',
    employeeId: '0000001',
    jobCode: '3201',
    jobLabel: 'Suppléant',
    workplaceCode: '515',
    workplaceLabel: 'École 515',
    reasonCode: 'force_majeure',
    reasonLabel: 'Force majeure',
    state: 'brouillon',
    notes: 'Besoin de repos après un déplacement',
  },
  {
    id: '7',
    startDate: '2025-08-06T09:15:00.000Z',
    endDate: '2025-08-08T09:15:00.000Z',
    createdAt: '2025-07-30T09:15:00.000Z',
    createdBy: 'Sophie Bergeron',
    employeeId: '0000001',
    jobCode: '3201',
    jobLabel: 'Suppléant',
    workplaceCode: '515',
    workplaceLabel: 'École 515',
    reasonCode: 'force_majeure',
    reasonLabel: 'Force majeure',
    state: 'brouillon',
    notes: 'Besoin de repos après un déplacement',
  },
];

// Options pour la pagination ET le tri
interface PaginationOptions {
  page: number;
  itemsPerPage: number;
  sortBy?: string;           // Colonne à trier
  sortOrder?: 'asc' | 'desc'; // Ordre du tri
}


// Résultat paginé
interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}


// Service principal pour gérer les demandes d'absence
export class AbsenceService {
  
  // Récupère les demandes avec filtrage et pagination
    async getDemands(
    filter: AbsenceFilter = {},
    pagination: PaginationOptions = { page: 1, itemsPerPage: 10 }
  ): Promise<PaginatedResult<AbsenceDemand>> {
    
    await this.sleep(300);
    
    let filtered = [...mockDemands];
    
    // Filtres (inchangé)
    if (filter.startDate) {
      const startDate = new Date(filter.startDate);
      filtered = filtered.filter(d => new Date(d.startDate) >= startDate);
    }
    
    if (filter.endDate) {
      const endDate = new Date(filter.endDate);
      filtered = filtered.filter(d => new Date(d.endDate) <= endDate);
    }
    
    if (filter.states && filter.states.length > 0) {
      filtered = filtered.filter(d => filter.states!.includes(d.state));
    }
    
    if (filter.reasons && filter.reasons.length > 0) {
      filtered = filtered.filter(d => filter.reasons!.includes(d.reasonCode));
    }
    
    if (filter.createdBy) {
      filtered = filtered.filter(d => 
        d.createdBy.toLowerCase().includes(filter.createdBy!.toLowerCase())
      );
    }
    
    // TRI
    if (pagination.sortBy) {
    filtered.sort((a, b) => {
        // Gestion spéciale pour les propriétés optionnelles
        let valA: any;
        let valB: any;
        
        if (pagination.sortBy === 'jobLabel' || pagination.sortBy === 'reasonLabel') {
        // Pour les propriétés optionnelles, utilisez la version avec code si label manquant
        valA = a[pagination.sortBy] || a[pagination.sortBy === 'jobLabel' ? 'jobCode' : 'reasonCode'];
        valB = b[pagination.sortBy] || b[pagination.sortBy === 'jobLabel' ? 'jobCode' : 'reasonCode'];
        } else {
        // Propriétés normales
        valA = a[pagination.sortBy as keyof AbsenceDemand];
        valB = b[pagination.sortBy as keyof AbsenceDemand];
        }
        
        // Gestion des valeurs nulles/undefined
        if (valA == null) return 1;
        if (valB == null) return -1;
        
        // Conversion des dates pour comparaison
        if (pagination.sortBy === 'startDate' || pagination.sortBy === 'endDate' || pagination.sortBy === 'createdAt') {
        valA = new Date(valA as string).getTime();
        valB = new Date(valB as string).getTime();
        }
        
        // Comparaison
        if (valA < valB) return pagination.sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return pagination.sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    }
    
    // Pagination (inchangé)
    const startIndex = (pagination.page - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, endIndex);
    
    return {
      items: paginatedItems,
      total: filtered.length,
      page: pagination.page,
      totalPages: Math.ceil(filtered.length / pagination.itemsPerPage),
    };
  }
  
  // Récupère une demande par son ID
  async getDemandById(id: string): Promise<AbsenceDemand | null> {
    await this.sleep(200);
    return mockDemands.find(d => d.id === id) || null;
  }
  
  // Helper pour simuler un délai
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Exporte une instance unique du service
export const absenceService = new AbsenceService();

