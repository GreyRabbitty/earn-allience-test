# Earn Alliance Backend Applications

Welcome to this backend repository for Earn Alliance! This repository contains the backend code and resources for the project. In this README, you will find information on how to get started with the backend development and contribute to the project.

## Technologies Used

- NestJS
- Temporal
- PostgreSQL
- Hasura

## Prerequisites

Before getting started, make sure you have bootup [hasura-ea](https://github.com/earn-alliance/hasura-ea#dev-setup).

Note! If your app needs to run based on Hasura triggers, you need to add an environment variable in the `hasura-ea` that points to the `hasura-webhooks` app in this repository.

## Getting Started

To get started with the backend development, follow these steps:

1. Clone the repository

2. Install the dependencies:

```
yarn
```

3. Set up the environment variables:

4. Rename the `.env.template` file to `.env`.

5. Start the development server:

```
yarn start:dev $APP
# I.e. to start wall-post-worker, run
yarn start:dev wall-post-worker
```

## Contact

If you have any questions or need assistance, feel free to contact us in the dedicated Slack channel.

We appreciate your contributions to Earn Alliance. Happy coding!
