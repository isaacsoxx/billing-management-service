export default () => ({
  database: process.env.CONN_STR_MONGO,
  aws_region: process.env.AWS_REGION,
  aws_pool_id: process.env.AWS_POOL_ID,
  aws_client_id: process.env.AWS_CLIENT_ID,
  aws_access_key: process.env.AWS_ACCESS_KEY,
  aws_secret_key: process.env.AWS_SECRET_KEY,
});
