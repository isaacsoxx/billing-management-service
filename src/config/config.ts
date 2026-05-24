export default () => ({
  database: process.env.CONN_STR_MONGO,
  aws_region: process.env.AWS_REGION,
  aws_pool_id: process.env.AWS_POOL_ID,
  aws_api_pool_client_id: process.env.AWS_API_POOL_CLIENT_ID,
  aws_api_pool_client_secret_key: process.env.AWS_API_POOL_CLIENT_SECRET_KEY,
  aws_ui_pool_client_id: process.env.AWS_UI_POOL_CLIENT_ID,
  aws_admin_access_key: process.env.AWS_ADMIN_ACCESS_KEY,
  aws_admin_secret_key: process.env.AWS_ADMIN_SECRET_KEY,
});
