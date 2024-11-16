export function getOriginUrl(): string {
   const env = process.env.NODE_ENV || 'development';
   const originUrl = process.env[`${env.toUpperCase()}_ORIGIN_URL`];

   if (!originUrl) {
      throw new Error(`API URL not defined for environment: ${env}`);
   }

   return originUrl;
}
