export default () => ({
  database: process.env.CONN_STR_MONGO,
  aws_pool_id: process.env.AWS_POOL_ID,
  aws_client_id: process.env.AWS_CLIENT_ID,
  aws_client_secret: process.env.AWS_SECRET,
});
