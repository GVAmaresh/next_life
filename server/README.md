# Alter Backend

## Project Structure

```
.
├── server
│   ├── database
│   │   └── json
│   │       ├── authentication
│   │       │   └── authJSON.ts
│   │       ├── controller
│   │       │   ├── doctorJsonController.ts
│   │       │   ├── homepageJsonController.ts
│   │       │   ├── bloodBankJsonController.ts
│   │       │   └── analyticsJsonController.ts
│   │       └── models
│   │           ├── doctorJsonModel.ts
│   │           ├── homepageJsonModel.ts
│   │           ├── bloodBankJsonModel.ts
│   │           └── analyticsJsonModel.ts
│   └── services
│       ├── middleware
│       ├── microservices
│       ├── controller
│       │   ├── doctorController.ts
│       │   ├── homepageController.ts
│       │   ├── bloodBankController.ts
│       │   └── analyticsController.ts
│       └── routes
│           ├── doctorRouter.ts
│           ├── homepageRouter.ts
│           ├── bloodBankRouter.ts
│           └── analyticsRouter.ts
├── server.ts                                      
├── app.ts
└── package.json

```

## alter-server
# alter-server
