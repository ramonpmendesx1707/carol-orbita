declare namespace Cloudflare {
  interface Env {
    ADMIN_INITIAL_HASH?: string;
    RESEND_API_KEY?: string;
    EMAIL_FROM?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
