import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma";



// Common password for all test users
const TEST_PASSWORD = "test123";

async function main() {
    console.log("Starting database seeding...");

    // Clear existing data
    console.log("Cleaning existing data...");
    await prisma.groupExpenseSplit.deleteMany();
    await prisma.groupExpense.deleteMany();
    await prisma.settlement.deleteMany();
    await prisma.group_memberships.deleteMany();
    await prisma.invitation.deleteMany();
    await prisma.personalExpense.deleteMany();
    await prisma.session.deleteMany();
    await prisma.group.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

    // Create test users
    console.log("Creating users...");
    const users = await Promise.all([
        // Main test account with lots of groups
        prisma.user.create({
            data: {
                username: "Alice Johnson",
                email: "alice@test.com",
                phoneNumber: "+1234567890",
                passwordHash: hashedPassword,
                profileImg: "https://i.pravatar.cc/150?img=1",
                updatedAt: new Date(),
            },
        }),
        // Secondary test account with some groups
        prisma.user.create({
            data: {
                username: "Bob Smith",
                email: "bob@test.com",
                phoneNumber: "+1234567891",
                passwordHash: hashedPassword,
                profileImg: "https://i.pravatar.cc/150?img=2",
                updatedAt: new Date(),
            },
        }),
        // Additional users for group interactions
        prisma.user.create({
            data: {
                username: "Charlie Davis",
                email: "charlie@test.com",
                phoneNumber: "+1234567892",
                passwordHash: hashedPassword,
                profileImg: "https://i.pravatar.cc/150?img=3",
                updatedAt: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                username: "Diana Martinez",
                email: "diana@test.com",
                phoneNumber: "+1234567893",
                passwordHash: hashedPassword,
                profileImg: "https://i.pravatar.cc/150?img=4",
                updatedAt: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                username: "Eve Wilson",
                email: "eve@test.com",
                phoneNumber: "+1234567894",
                passwordHash: hashedPassword,
                profileImg: "https://i.pravatar.cc/150?img=5",
                updatedAt: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                username: "Frank Brown",
                email: "frank@test.com",
                phoneNumber: "+1234567895",
                passwordHash: hashedPassword,
                profileImg: "https://i.pravatar.cc/150?img=6",
                updatedAt: new Date(),
            },
        }),
    ]);

    const [alice, bob, charlie, diana, eve, frank] = users;
    console.log(`Created ${users.length} users`);

    // Define expense categories
    const categories = ["Food", "Transport", "Entertainment", "Utilities", "Shopping", "Travel", "Groceries"];
    const expenseDescriptions = {
        Food: ["Dinner at restaurant", "Pizza night", "Lunch delivery", "Coffee shop", "Breakfast brunch"],
        Transport: ["Uber ride", "Gas refill", "Taxi to airport", "Train tickets", "Parking fee"],
        Entertainment: ["Movie tickets", "Concert tickets", "Gaming night", "Museum entry", "Bowling"],
        Utilities: ["Electricity bill", "Internet bill", "Water bill", "Phone bill", "Gas bill"],
        Shopping: ["Home supplies", "Clothes shopping", "Electronics", "Furniture", "Decorations"],
        Travel: ["Hotel booking", "Flight tickets", "Rental car", "Tour package", "Visa fees"],
        Groceries: ["Weekly groceries", "Vegetables", "Snacks", "Beverages", "Household items"],
    };

    // Create groups for Alice (lots of groups)
    console.log("Creating groups for Alice...");
    const aliceGroups = await Promise.all([
        // Group 1: Apartment Flatmates
        prisma.group.create({
            data: {
                groupName: "Apartment Flatmates",
                createdBy: alice.userId,
                createdAt: new Date("2024-01-15"),
            },
        }),
        // Group 2: Weekend Trip Crew
        prisma.group.create({
            data: {
                groupName: "Weekend Trip Crew",
                createdBy: alice.userId,
                createdAt: new Date("2024-02-01"),
            },
        }),
        // Group 3: Office Lunch Group
        prisma.group.create({
            data: {
                groupName: "Office Lunch Squad",
                createdBy: alice.userId,
                createdAt: new Date("2024-01-20"),
            },
        }),
        // Group 4: Gym Buddies
        prisma.group.create({
            data: {
                groupName: "Gym Buddies",
                createdBy: alice.userId,
                createdAt: new Date("2024-02-10"),
            },
        }),
        // Group 5: Study Group
        prisma.group.create({
            data: {
                groupName: "Study Group",
                createdBy: alice.userId,
                createdAt: new Date("2024-01-25"),
            },
        }),
        // Group 6: Gaming Night
        prisma.group.create({
            data: {
                groupName: "Gaming Night",
                createdBy: alice.userId,
                createdAt: new Date("2024-02-05"),
            },
        }),
    ]);

    console.log(`Created ${aliceGroups.length} groups for Alice`);

    // Create groups for Bob (some groups)
    console.log("Creating groups for Bob...");
    const bobGroups = await Promise.all([
        // Group 1: Family Vacation
        prisma.group.create({
            data: {
                groupName: "Family Vacation",
                createdBy: bob.userId,
                createdAt: new Date("2024-02-15"),
            },
        }),
        // Group 2: Football Team
        prisma.group.create({
            data: {
                groupName: "Football Team",
                createdBy: bob.userId,
                createdAt: new Date("2024-01-10"),
            },
        }),
        // Group 3: Book Club
        prisma.group.create({
            data: {
                groupName: "Book Club",
                createdBy: bob.userId,
                createdAt: new Date("2024-02-20"),
            },
        }),
    ]);

    console.log(`Created ${bobGroups.length} groups for Bob`);

    // Create group memberships
    console.log("Creating group memberships...");

    // Alice's groups memberships
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[0].groupId, userId: alice.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[0].groupId, userId: bob.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[0].groupId, userId: charlie.userId, role: "member" },
    });

    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[1].groupId, userId: alice.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[1].groupId, userId: diana.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[1].groupId, userId: eve.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[1].groupId, userId: frank.userId, role: "member" },
    });

    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[2].groupId, userId: alice.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[2].groupId, userId: bob.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[2].groupId, userId: charlie.userId, role: "member" },
    });

    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[3].groupId, userId: alice.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[3].groupId, userId: diana.userId, role: "member" },
    });

    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[4].groupId, userId: alice.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[4].groupId, userId: eve.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[4].groupId, userId: frank.userId, role: "member" },
    });

    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[5].groupId, userId: alice.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: aliceGroups[5].groupId, userId: charlie.userId, role: "member" },
    });

    // Bob's groups memberships
    await prisma.group_memberships.create({
        data: { groupId: bobGroups[0].groupId, userId: bob.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: bobGroups[0].groupId, userId: alice.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: bobGroups[0].groupId, userId: charlie.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: bobGroups[0].groupId, userId: diana.userId, role: "member" },
    });

    await prisma.group_memberships.create({
        data: { groupId: bobGroups[1].groupId, userId: bob.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: bobGroups[1].groupId, userId: charlie.userId, role: "member" },
    });
    await prisma.group_memberships.create({
        data: { groupId: bobGroups[1].groupId, userId: frank.userId, role: "member" },
    });

    await prisma.group_memberships.create({
        data: { groupId: bobGroups[2].groupId, userId: bob.userId, role: "admin" },
    });
    await prisma.group_memberships.create({
        data: { groupId: bobGroups[2].groupId, userId: eve.userId, role: "member" },
    });

    console.log("Created group memberships");

    // Helper function to create expenses with splits
    async function createExpenseWithSplits(
        groupId: number,
        paidBy: number,
        title: string,
        amount: number,
        splitMembers: number[],
        createdAt: Date
    ) {
        const expense = await prisma.groupExpense.create({
            data: {
                groupId,
                paidBy,
                title,
                amount,
                splitType: "equal",
                createdAt,
            },
        });

        const splitAmount = amount / splitMembers.length;
        await Promise.all(
            splitMembers.map((userId) =>
                prisma.groupExpenseSplit.create({
                    data: {
                        expenseId: expense.expenseId,
                        userId,
                        shareAmount: splitAmount,
                    },
                })
            )
        );

        return expense;
    }

    // Create expenses for Group 1: Apartment Flatmates
    console.log("Creating expenses for Apartment Flatmates...");
    await createExpenseWithSplits(
        aliceGroups[0].groupId,
        alice.userId,
        "Monthly Rent",
        1800,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-01")
    );
    await createExpenseWithSplits(
        aliceGroups[0].groupId,
        bob.userId,
        "Electricity Bill",
        150,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-05")
    );
    await createExpenseWithSplits(
        aliceGroups[0].groupId,
        charlie.userId,
        "Internet Bill",
        80,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-07")
    );
    await createExpenseWithSplits(
        aliceGroups[0].groupId,
        alice.userId,
        "Groceries for House",
        240,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-10")
    );
    await createExpenseWithSplits(
        aliceGroups[0].groupId,
        bob.userId,
        "Cleaning Supplies",
        60,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-12")
    );

    // Create expenses for Group 2: Weekend Trip
    console.log("Creating expenses for Weekend Trip...");
    await createExpenseWithSplits(
        aliceGroups[1].groupId,
        alice.userId,
        "Hotel Booking",
        800,
        [alice.userId, diana.userId, eve.userId, frank.userId],
        new Date("2024-02-14")
    );
    await createExpenseWithSplits(
        aliceGroups[1].groupId,
        diana.userId,
        "Car Rental",
        320,
        [alice.userId, diana.userId, eve.userId, frank.userId],
        new Date("2024-02-15")
    );
    await createExpenseWithSplits(
        aliceGroups[1].groupId,
        eve.userId,
        "Dinner at Beach Restaurant",
        180,
        [alice.userId, diana.userId, eve.userId, frank.userId],
        new Date("2024-02-16")
    );
    await createExpenseWithSplits(
        aliceGroups[1].groupId,
        frank.userId,
        "Gas for Road Trip",
        120,
        [alice.userId, diana.userId, eve.userId, frank.userId],
        new Date("2024-02-16")
    );
    await createExpenseWithSplits(
        aliceGroups[1].groupId,
        alice.userId,
        "Breakfast Buffet",
        96,
        [alice.userId, diana.userId, eve.userId, frank.userId],
        new Date("2024-02-17")
    );

    // Create expenses for Group 3: Office Lunch
    console.log("Creating expenses for Office Lunch Squad...");
    await createExpenseWithSplits(
        aliceGroups[2].groupId,
        alice.userId,
        "Pizza Lunch",
        45,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-19")
    );
    await createExpenseWithSplits(
        aliceGroups[2].groupId,
        bob.userId,
        "Sushi Delivery",
        72,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-21")
    );
    await createExpenseWithSplits(
        aliceGroups[2].groupId,
        charlie.userId,
        "Coffee Run",
        18,
        [alice.userId, bob.userId, charlie.userId],
        new Date("2024-02-22")
    );

    // Create expenses for Group 4: Gym Buddies
    console.log("Creating expenses for Gym Buddies...");
    await createExpenseWithSplits(
        aliceGroups[3].groupId,
        alice.userId,
        "Monthly Gym Membership",
        90,
        [alice.userId, diana.userId],
        new Date("2024-02-01")
    );
    await createExpenseWithSplits(
        aliceGroups[3].groupId,
        diana.userId,
        "Protein Powder",
        60,
        [alice.userId, diana.userId],
        new Date("2024-02-15")
    );

    // Create expenses for Bob's groups
    console.log("Creating expenses for Bob's groups...");
    await createExpenseWithSplits(
        bobGroups[0].groupId,
        bob.userId,
        "Flight Tickets",
        1600,
        [bob.userId, alice.userId, charlie.userId, diana.userId],
        new Date("2024-02-20")
    );
    await createExpenseWithSplits(
        bobGroups[0].groupId,
        alice.userId,
        "Resort Booking",
        2400,
        [bob.userId, alice.userId, charlie.userId, diana.userId],
        new Date("2024-02-21")
    );
    await createExpenseWithSplits(
        bobGroups[0].groupId,
        charlie.userId,
        "Tour Packages",
        800,
        [bob.userId, alice.userId, charlie.userId, diana.userId],
        new Date("2024-02-22")
    );

    await createExpenseWithSplits(
        bobGroups[1].groupId,
        bob.userId,
        "Team Jersey",
        180,
        [bob.userId, charlie.userId, frank.userId],
        new Date("2024-02-10")
    );
    await createExpenseWithSplits(
        bobGroups[1].groupId,
        charlie.userId,
        "Football Equipment",
        150,
        [bob.userId, charlie.userId, frank.userId],
        new Date("2024-02-12")
    );

    console.log("Created expenses with splits");

    // Create some personal expenses
    console.log("Creating personal expenses...");
    await prisma.personalExpense.createMany({
        data: [
            {
                userId: alice.userId,
                title: "Coffee",
                amount: 5.5,
                category: "Food",
                createdAt: new Date("2024-02-18"),
            },
            {
                userId: alice.userId,
                title: "Book Purchase",
                amount: 25,
                category: "Shopping",
                createdAt: new Date("2024-02-19"),
            },
            {
                userId: bob.userId,
                title: "Haircut",
                amount: 30,
                category: "Personal Care",
                createdAt: new Date("2024-02-20"),
            },
            {
                userId: bob.userId,
                title: "Movie Ticket",
                amount: 15,
                category: "Entertainment",
                createdAt: new Date("2024-02-21"),
            },
        ],
    });

    console.log("Created personal expenses");

    // Create some settlements
    console.log("Creating settlements...");
    await prisma.settlement.createMany({
        data: [
            {
                groupId: aliceGroups[0].groupId,
                paidBy: bob.userId,
                paidTo: alice.userId,
                amount: 650,
                createdAt: new Date("2024-02-15"),
                isCompleted: true,
            },
            {
                groupId: aliceGroups[2].groupId,
                paidBy: charlie.userId,
                paidTo: alice.userId,
                amount: 30,
                createdAt: new Date("2024-02-23"),
                isCompleted: false,
            },
        ],
    });

    console.log("Created settlements");

    console.log("\nSeeding completed successfully!");
    console.log("\nTest Accounts:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Account 1 (Many Groups):");
    console.log(`  Email: alice@test.com`);
    console.log(`  Password: ${TEST_PASSWORD}`);
    console.log(`  Groups: ${aliceGroups.length}`);
    console.log("\nAccount 2 (Some Groups):");
    console.log(`  Email: bob@test.com`);
    console.log(`  Password: ${TEST_PASSWORD}`);
    console.log(`  Groups: ${bobGroups.length}`);
    console.log("\nAdditional Test Users:");
    console.log("  charlie@test.com");
    console.log("  diana@test.com");
    console.log("  eve@test.com");
    console.log("  frank@test.com");
    console.log(`  All passwords: ${TEST_PASSWORD}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
    .catch((e) => {
        console.error("Error during seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
