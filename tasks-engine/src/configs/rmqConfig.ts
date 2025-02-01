export const rmqConfig = {
  host: process.env.RABBITMQ_HOST,
  password: process.env.RABBITMQ_PASSWORD,
  user: process.env.RABBITMQ_USER,
  port: Number(process.env.RABBITMQ_PORT)
};
