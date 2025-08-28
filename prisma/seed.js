const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


async function main() {
    const action = process.argv[2];
    if (action === 'populate') {
        const demoUsers = [
            { name: "Juan Pérez", email: "juan.perez@example.com", password: "1234", role: "USER" },
            { name: "María López", email: "maria.lopez@example.com", password: "1234", role: "USER" },
            { name: "Carlos García", email: "carlos.garcia@example.com", password: "1234", role: "USER" },
            { name: "Francisco Salinas", email: "francisco.salinas@example.com", password: "1234", role: "ADMIN" },
            { name: "Paula Castro", email: "paula.castro@example.com", password: "1234", role: "USER" },
        ];
        for (const user of demoUsers) {
            await prisma.user.create({ data: user });
        }
        console.log("Usuarios de demostración creados con éxito");
    } else if (action === 'clear') {
        await prisma.user.deleteMany();
        console.log("Todos los usuarios han sido eliminados");
    } else {
        console.log("Acción no reconocida. Usa 'populate' para poblar o 'clear' para eliminar.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
