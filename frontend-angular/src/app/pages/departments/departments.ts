// Resumo do fluxo desse arquivo: ele carrega departamentos ao abrir a tela, usa signal para atualizar a lista automaticamente, 
// cadastra/edita/exclui com atualização instantânea na interface e conversa com o backend por meio do DepartmentService.

//Importa recursos principais do Angular.
// Component: permite criar um componente.
// OnInit: interface usada para executar uma função quando o componente inicia.
// signal: recurso moderno do Angular para estado reativo.
import { Component, OnInit, signal } from '@angular/core';

// CommonModule libera diretivas comuns no HTML, como *ngIf e *ngFor.
import { CommonModule } from '@angular/common';

// FormsModule permite usar [(ngModel)] no HTML para ligar inputs às variáveis do TypeScript.
import { FormsModule } from '@angular/forms';

// Importa a interface Department e o service responsável por conversar com a API de departamentos.
import { Department, DepartmentService } from '../../services/departmentService';

@Component({
  // Nome da tag HTML do componente.
  // Exemplo: <app-departments></app-departments>
  selector: 'app-departments',

  // Como este é um componente standalone, os módulos usados no HTML precisam ser importados aqui.
  imports: [CommonModule, FormsModule],

  // Arquivo HTML da tela.
  templateUrl: './departments.html',

  // Arquivo CSS da tela.
  styleUrl: './departments.css',
})
export class Departments implements OnInit {
  // Lista reativa de departamentos.
  // O signal permite que a tela atualize automaticamente quando a lista mudar.
  departments = signal<Department[]>([]);

  // Guarda o texto digitado no input de nome do departamento.
  // Está ligado no HTML com [(ngModel)]="departmentName".
  departmentName = '';

  // Guarda o departamento que está sendo editado.
  // Quando for null, significa que o formulário está em modo de cadastro.
  // Quando tiver um Department, significa que está em modo de edição.
  editingDepartment: Department | null = null;

  // Injeta o DepartmentService no componente.
  // Esse service é usado para chamar a API .NET.
  constructor(private departmentService: DepartmentService) {}

  // Método executado automaticamente quando o componente é carregado na tela.
  ngOnInit(): void {
    // Assim que a tela abre, busca os departamentos cadastrados no backend.
    this.loadDepartments();
  }

  // Busca a lista de departamentos na API.
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      // Se a API responder com sucesso, salva os dados dentro do signal.
      next: (data) => {
        this.departments.set(data);
      },

      // Se a API der erro, mostra o erro no console do navegador.
      error: (error) => {
        console.error('Erro ao buscar departamentos:', error);
      },
    });
  }

  // Decide se deve cadastrar um novo departamento ou atualizar um existente.
  saveDepartment(): void {
    // Valida se o campo foi preenchido.
    // trim() remove espaços no início e no fim.
    if (!this.departmentName.trim()) {
      alert('Informe o nome do departamento.');
      return;
    }

    // Se editingDepartment tiver valor, significa que o usuário clicou em "Editar".
    // Então chama a função de atualização.
    if (this.editingDepartment) {
      this.updateDepartmentInstantly();
      return;
    }

    // Se não estiver editando, cria um novo departamento.
    this.createDepartmentInstantly();
  }

  // Cria um novo departamento usando atualização otimista.
  // Atualização otimista significa:
  // 1. Mostra o item na tela imediatamente.
  // 2. Depois envia para o backend.
  // 3. Se der certo, troca o item temporário pelo item real.
  // 4. Se der erro, remove o item temporário.
  private createDepartmentInstantly(): void {
    // Cria um ID temporário negativo.
    // Isso evita conflito com IDs reais do banco, que normalmente são positivos.
    const tempId = Date.now() * -1;

    // Objeto temporário exibido imediatamente na tabela.
    const temporaryDepartment: Department = {
      id: tempId,
      departmentName: this.departmentName,
    };

    // Objeto enviado para a API.
    // Partial<Department> significa que não precisamos enviar todos os campos da interface.
    // Nesse caso, enviamos apenas o nome, porque o ID será gerado pelo banco.
    const payload: Partial<Department> = {
      departmentName: this.departmentName,
    };

    // Adiciona o departamento temporário na lista da tela.
    // update() pega o valor atual da lista e retorna uma nova lista com o novo item.
    this.departments.update((current) => [...current, temporaryDepartment]);

    // Limpa o input imediatamente depois de adicionar na tela.
    this.departmentName = '';

    // Chama a API para salvar o departamento no backend.
    this.departmentService.createDepartment(payload).subscribe({
      // Se a API salvar com sucesso, ela retorna o departamento real com ID correto.
      next: (createdDepartment) => {
        // Substitui o departamento temporário pelo departamento real retornado pela API.
        this.departments.update((current) =>
          current.map((department) =>
            department.id === tempId ? createdDepartment : department
          )
        );
      },

      // Se a API der erro, desfaz a atualização otimista.
      error: (error) => {
        console.error('Erro ao cadastrar departamento:', error);

        // Remove da lista o departamento temporário que tinha sido colocado na tela.
        this.departments.update((current) =>
          current.filter((department) => department.id !== tempId)
        );

        alert('Não foi possível cadastrar o departamento.');
      },
    });
  }

  // Atualiza um departamento existente também usando atualização otimista.
  private updateDepartmentInstantly(): void {
    // Segurança extra: se não houver departamento em edição, não faz nada.
    if (!this.editingDepartment) {
      return;
    }

    // Guarda uma cópia do departamento antes da alteração.
    // Essa cópia será usada para desfazer a mudança caso a API dê erro.
    const previousDepartment: Department = { ...this.editingDepartment };

    // Cria o departamento atualizado com o novo nome digitado.
    const updatedDepartment: Department = {
      ...this.editingDepartment,
      departmentName: this.departmentName,
    };

    // Atualiza a tabela imediatamente, antes mesmo da API responder.
    this.departments.update((current) =>
      current.map((department) =>
        department.id === updatedDepartment.id ? updatedDepartment : department
      )
    );

    // Sai do modo de edição e limpa o formulário.
    this.cancelEdit();

    // Envia a alteração para a API.
    this.departmentService
      .updateDepartment(updatedDepartment.id, updatedDepartment)
      .subscribe({
        // Se der certo, não precisa fazer nada,
        // porque a tela já foi atualizada antes.
        next: () => {},

        // Se der erro, volta o departamento para o valor anterior.
        error: (error) => {
          console.error('Erro ao atualizar departamento:', error);

          // Reverte a alteração na lista.
          this.departments.update((current) =>
            current.map((department) =>
              department.id === previousDepartment.id
                ? previousDepartment
                : department
            )
          );

          alert('Não foi possível atualizar o departamento.');
        },
      });
  }

  // Coloca o formulário em modo de edição.
  editDepartment(department: Department): void {
    // Salva o departamento selecionado na variável de edição.
    this.editingDepartment = department;

    // Preenche o input com o nome atual do departamento.
    this.departmentName = department.departmentName;
  }

  // Cancela a edição e limpa o formulário.
  cancelEdit(): void {
    // Remove o modo de edição.
    this.editingDepartment = null;

    // Limpa o campo de nome.
    this.departmentName = '';
  }

  // Exclui um departamento.
  deleteDepartment(id: number): void {
    // Pede confirmação antes de excluir.
    const confirmDelete = confirm('Deseja excluir este departamento?');

    // Se o usuário cancelar, interrompe a função.
    if (!confirmDelete) {
      return;
    }

    // Guarda o departamento que será removido.
    // Isso permite restaurar o item na tela caso a API dê erro.
    const removedDepartment = this.departments().find(
      (department) => department.id === id
    );

    // Remove o departamento da tela imediatamente.
    this.departments.update((current) =>
      current.filter((department) => department.id !== id)
    );

    // Envia a exclusão para o backend.
    this.departmentService.deleteDepartment(id).subscribe({
      // Se der certo, não precisa fazer nada,
      // porque o item já foi removido da tela.
      next: () => {},

      // Se der erro, recoloca o departamento na lista.
      error: (error) => {
        console.error('Erro ao excluir departamento:', error);

        // Se encontrou o departamento antes de excluir,
        // adiciona ele novamente na lista.
        if (removedDepartment) {
          this.departments.update((current) => [...current, removedDepartment]);
        }

        alert('Não foi possível excluir o departamento.');
      },
    });
  }
}