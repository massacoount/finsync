const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Finsync API',
      version: '1.0.0',
      description: 'API documentation for Finsync application',
    },
    servers: [
      {
        url: 'https://api.finsync.masssolution.org',
      }
    ],
    tags: [
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Categories', description: 'Category management endpoints' },
      { name: 'Accounts', description: 'Account management endpoints' },
      { name: 'Transactions', description: 'Transaction management endpoints' },
      { name: 'Journals', description: 'Journal management endpoints' },
      { name: 'BudgetTargets', description: 'Budget target management endpoints' },
      { name: 'Auth', description: 'Authentication endpoints' }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string' },
            name: { type: 'string' },
            password: { type: 'string' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            type: { type: 'string' },
            notes: { type: 'string' }
          }
        },
        Account: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            account_type: { type: 'string' },
            description: { type: 'string' }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date-time' },
            amount: { type: 'number' },
            description: { type: 'string' },
            user_id: { type: 'string', format: 'uuid' },
            category_id: { type: 'string', format: 'uuid' },
            account_id: { type: 'string', format: 'uuid' }
          }
        },
        Journal: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date-time' },
            journal_entry: { type: 'string' },
            transaction_id: { type: 'string', format: 'uuid' }
          }
        },
        BudgetTarget: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            category_id: { type: 'string', format: 'uuid' },
            monthly_target: { type: 'number' },
            notes: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>'
        }
      }
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/users': {
        post: {
          security: [{ bearerAuth: [] }],
          tags: ['Users'],
          summary: 'Create a new user',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'User created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/User'
                  }
                }
              }
            }
          }
        },
        get: {
          security: [{ bearerAuth: [] }],
          tags: ['Users'],
          summary: 'Get all users',
          responses: {
            200: {
              description: 'List of all users',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/User'
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Invalid or missing token'
            }
          }
        }
      },
      '/categories': {
        post: {
          security: [{ bearerAuth: [] }],
          tags: ['Categories'],
          summary: 'Create a new category',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Category'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Category created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Category'
                  }
                }
              }
            }
          }
        }
      },
      '/auth/token': {
        post: {
          security: [],
          tags: ['Auth'],
          summary: 'Generate JWT access and refresh tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    email: {
                      type: 'string',
                      example: 'user@example.com'
                    },
                    password: {
                      type: 'string',
                      example: 'password'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Tokens generated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: {
                        type: 'string'
                      },
                      refreshToken: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/auth/refresh': {
        post: {
          security: [],
          tags: ['Auth'],
          summary: 'Refresh JWT access token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: {
                      type: 'string',
                      example: 'your-refresh-token'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Access token refreshed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      accessToken: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [] // Remove the reference to external files
};

const specs = swaggerJsdoc(swaggerOptions);

module.exports = specs;
