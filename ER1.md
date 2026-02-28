---
config:
  layout: elk
---
erDiagram
	direction LR
	USERS {
		int userId PK ""  
		string name  ""  
		string email  "" 
        int phonenumber PK 
		string password  ""  
		datetime createdAt  ""  
	}

	GROUPS {
		int groupId PK ""  
		string groupName  ""  
		int createdBy FK ""  
		datetime createdAt  ""  
	}

	GROUP_MEMBERSHIP {
		int membershipId PK ""  
		int userId FK ""  
		int groupId FK ""  
		datetime joinedAt  ""  
	}

	EXPENSES {
		int expenseId PK ""  
		int groupId FK ""  
		int paidBy FK ""  
		string title  ""  
		decimal amount  ""  
		string splitType  ""  
		datetime createdAt  ""  
	}

	EXPENSE_SPLITS {
		int splitId PK ""  
		int expenseId FK ""  
		int userId FK ""  
		decimal shareAmount  ""  
		boolean isSettled  ""  
	}

	USERS||--o{GROUP_MEMBERSHIP:"joins"
	GROUPS||--o{GROUP_MEMBERSHIP:"contains"
	GROUPS||--o{EXPENSES:"has"
	USERS||--o{EXPENSES:"pays"
	EXPENSES||--o{EXPENSE_SPLITS:"divided_into"
	USERS||--o{EXPENSE_SPLITS:"owes"