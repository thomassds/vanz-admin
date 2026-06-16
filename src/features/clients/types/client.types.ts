export interface Client {
  id: string;
  name: string;
  taxIdentifier: string;
  phone: string | null;
  email: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Dependent {
  id: string;
  clientId: string;
  name: string;
  taxIdentifier: string;
  birthDate: string | null;
}

export interface ClientFilters {
  page: number;
  limit: number;
  name?: string;
  taxIdentifier?: string;
  status?: string;
}

export interface CreateClientDTO {
  name: string;
  taxIdentifier: string;
  phone?: string;
  email?: string;
}

export interface UpdateClientDTO {
  id: string;
  name: string;
  taxIdentifier: string;
  phone?: string;
  email?: string;
}

export interface CreateDependentDTO {
  clientId: string;
  name: string;
  taxIdentifier: string;
  birthDate?: string;
}

export interface UpdateDependentDTO {
  id: string;
  name: string;
  taxIdentifier: string;
  birthDate?: string;
}
