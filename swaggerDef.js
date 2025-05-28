module.exports = {
    openapi: '3.0.0',
    info: {
        title: 'PediHoje API',
        version: '1.0.0',
        description: 'Documentação da API',
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Nome do Usuário' },
                    email: { type: 'string', example: 'user@example.com' },
                    password: { type: 'string', example: 'senha123' },
                    token: { type: 'string', example: 'hashed_token' },
                    cnpjCpf: { type: 'string', example: '12345678900' },
                    phone: { type: 'string', example: '11999999999' },
                    street: { type: 'string', example: 'Rua Exemplo' },
                    houseNumber: { type: 'string', example: '123' },
                    neighborhood: { type: 'string', example: 'Bairro Exemplo' },
                    city: { type: 'string', example: 'Cidade Exemplo' },
                    uf: { type: 'string', example: 'SP' },
                    ddd: { type: 'string', example: '11' },
                    complement: { type: 'string', example: 'Complemento' },
                    resetToken: { type: 'string', example: 'reset_token' },
                    isAdmin: { type: 'boolean', example: false },
                    isStore: { type: 'boolean', example: false },
                    isLogged: { type: 'boolean', example: false },
                    isActive: { type: 'boolean', example: false },
                    lastLogin: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
                    createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00.000Z' },
                    cep: { type: 'string', example: '12345678' },
                    location: {
                        type: 'object',
                        properties: {
                            latitude: { type: 'number', format: 'float', example: -23.564223 },
                            longitude: { type: 'number', format: 'float', example: -46.653156 }
                        }
                    }
                },
                required: ['name', 'email', 'password'],
            },
        },
    },
    security: [{ bearerAuth: [] }],
};