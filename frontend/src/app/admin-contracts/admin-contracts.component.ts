import { Component, OnInit } from '@angular/core';
import { ContractService } from '../services/contract.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ContractService],
  selector: 'app-admin-contracts',
  templateUrl: './admin-contracts.component.html',
  styleUrls: ['./admin-contracts.component.css'],
})
export class AdminContractsComponent implements OnInit {
  contracts: any[] = []; // Lista de contratos
  filteredContracts: any[] = []; // Lista de contratos filtrados
  errorMessage: string = '';
  filters = {
    clientName: '',
    startDate: '',
    expirationDate: '',
    medicalCheckups: 100, // Filtro para el máximo de reconocimientos
    maxCheckups: 100,
  };

  constructor(private contractService: ContractService) {}

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.contractService.getAllContracts().subscribe({
      next: (response: any[]) => {
        console.log('Contratos cargados:', response);
        this.contracts = response;

        // Calcular el valor máximo de reconocimientos dinámicamente
        const maxCheckups = Math.max(
          ...response.map((contract) => contract.medical_checkups_count || 0)
        );
        this.filters.medicalCheckups = maxCheckups;
        this.filters.maxCheckups = maxCheckups;

        this.filteredContracts = response; // Inicializar contratos filtrados
      },
      error: (err) => {
        console.error('Error al cargar los contratos:', err);
        this.errorMessage = 'Ocurrió un error al cargar los contratos.';
      },
    });
  }

  applyFilters(): void {
    this.filteredContracts = this.contracts.filter((contract) => {
      const matchesClient =
        !this.filters.clientName ||
        `${contract.client_name} ${contract.client_lastname}`
          .toLowerCase()
          .includes(this.filters.clientName.toLowerCase());

      const matchesStartDate =
        !this.filters.startDate ||
        contract.start_date >= this.filters.startDate;

      const matchesExpirationDate =
        !this.filters.expirationDate ||
        contract.expiration_date <= this.filters.expirationDate;

      const matchesMedicalCheckups =
        contract.medical_checkups_count <= this.filters.medicalCheckups;

      return (
        matchesClient &&
        matchesStartDate &&
        matchesExpirationDate &&
        matchesMedicalCheckups
      );
    });
  }

  clearFilters(): void {
    this.filters = {
      clientName: '',
      startDate: '',
      expirationDate: '',
      medicalCheckups: this.filters.maxCheckups,
      maxCheckups: this.filters.maxCheckups,
    };
    this.filteredContracts = this.contracts; // Restaurar lista completa
  }
}
