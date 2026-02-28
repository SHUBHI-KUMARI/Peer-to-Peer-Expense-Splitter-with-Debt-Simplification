---
config:
  layout: elk
---
erDiagram
	direction LR
	USERS {
		int userId PK ""  
		string username  ""  
		string email UK ""  
		string phoneNumber UK ""  
		string passwordHash  ""  
		string googleId UK ""  
		string profileImg  ""  
		boolean isActive  ""  
		datetime createdAt  ""  
		datetime updatedAt  ""  
	}

	SESSIONS {
		int sessionId PK ""  
		int userId FK ""  
		string refreshToken  ""  
		datetime expiresAt  ""  
		datetime createdAt  ""  
	}

	GROUPS {
		int groupId PK ""  
		string groupName  ""  
		int createdBy FK ""  
		boolean isDeleted  ""  
		datetime createdAt  ""  
	}

	GROUP_MEMBERSHIP {
		int membershipId PK ""  
		int userId FK ""  
		int groupId FK ""  
		string role  ""  
		boolean isActive  ""  
		datetime joinedAt  ""  
	}

	INVITATIONS {
		int invitationId PK ""  
		int groupId FK ""  
		string invitedPhone  ""  
		int invitedBy FK ""  
		string status  ""  
		datetime createdAt  ""  
	}

	GROUP_EXPENSES {
		int expenseId PK ""  
		int groupId FK ""  
		int paidBy FK ""  
		string title  ""  
		string description  ""  
		decimal amount  ""  
		boolean isDeleted  ""  
		datetime createdAt  ""  
	}

	GROUP_EXPENSE_SPLITS {
		int splitId PK ""  
		int expenseId FK ""  
		int userId FK ""  
		decimal shareAmount  ""  
		boolean isSettled  ""  
	}

	PERSONAL_EXPENSES {
		int personalExpenseId PK ""  
		int userId FK ""  
		string title  ""  
		string description  ""  
		decimal amount  ""  
		string category  ""  
		datetime createdAt  ""  
	}

	SETTLEMENTS {
		int settlementId PK ""  
		int groupId FK ""  
		int paidBy FK ""  
		int paidTo FK ""  
		decimal amount  ""  
		datetime createdAt  ""  
	}

	NOTIFICATIONS {
		int notificationId PK ""  
		int userId FK ""  
		string type  ""  
		string message  ""  
		boolean isRead  ""  
		datetime createdAt  ""  
	}

	USERS||--o{SESSIONS:"has"
	USERS||--o{GROUP_MEMBERSHIP:"has"
	USERS||--o{PERSONAL_EXPENSES:"creates"
	USERS||--o{GROUP_EXPENSES:"pays"
	USERS||--o{GROUP_EXPENSE_SPLITS:"splits"
	USERS||--o{SETTLEMENTS:"part_of"
	USERS||--o{NOTIFICATIONS:"receives"
	GROUPS||--o{GROUP_MEMBERSHIP:"contains"
	GROUPS||--o{INVITATIONS:"sends"
	GROUPS||--o{GROUP_EXPENSES:"has"
	GROUPS||--o{SETTLEMENTS:"settled"
	GROUPS||--o{NOTIFICATIONS:"notifies"
	GROUP_EXPENSES||--o{GROUP_EXPENSE_SPLITS:"splits"
	GROUP_EXPENSES||--o{SETTLEMENTS:"includes"
	GROUP_EXPENSE_SPLITS||--o{PERSONAL_EXPENSES:"references"
	GROUP_EXPENSE_SPLITS||--o{SETTLEMENTS:"settles"