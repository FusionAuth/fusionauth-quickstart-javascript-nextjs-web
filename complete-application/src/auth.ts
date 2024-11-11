import NextAuth from 'next-auth';
import FusionAuth from "next-auth/providers/fusionauth"

const fusionAuthIssuer = process.env.FUSIONAUTH_ISSUER;
const fusionAuthClientId = process.env.FUSIONAUTH_CLIENT_ID;
const fusionAuthClientSecret = process.env.FUSIONAUTH_CLIENT_SECRET;
const fusionAuthUrl = process.env.FUSIONAUTH_URL;
const fusionAuthTenantId = process.env.FUSIONAUTH_TENANT_ID;

const missingError = 'missing in environment variables.';
if (!fusionAuthIssuer) {
    throw Error('FUSIONAUTH_ISSUER' + missingError)
}
if (!fusionAuthClientId) {
    throw Error('FUSIONAUTH_CLIENT_ID' + missingError)
}
if (!fusionAuthClientSecret) {
    throw Error('FUSIONAUTH_CLIENT_SECRET' + missingError)
}
if (!fusionAuthUrl) {
    throw Error('FUSIONAUTH_URL' + missingError)
}
if (!fusionAuthTenantId) {
    throw Error('FUSIONAUTH_TENANT_ID' + missingError)
}

const faProvider = FusionAuth({
    issuer: fusionAuthIssuer,
    clientId: fusionAuthClientId,
    clientSecret: fusionAuthClientSecret,
    wellKnown: `${fusionAuthUrl}/.well-known/openid-configuration/${fusionAuthTenantId}`,
    tenantId: fusionAuthTenantId, // Only required if you're using multi-tenancy
    authorization:{
        params:{
            scope: 'openid offline_access email profile'
        },
        url: 'https://local.fusionauth.io/oauth2/authorize'
    },
    userinfo: `${fusionAuthUrl}/oauth2/userinfo`,
    token: {
        url: `${fusionAuthUrl}/oauth2/token`,
        conform: async (response: Response) => {
          if (response.status === 401) return response;
    
          const newHeaders = Array.from(response.headers.entries())
            .filter(([key]) => key.toLowerCase() !== "www-authenticate")
            .reduce((headers, [key, value]) => (headers.append(key, value), headers), new Headers());
    
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        },
      },
})

// https://github.com/nextauthjs/next-auth/issues/10867
faProvider.type = "oidc";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [faProvider],
  secret: process.env.NEXTAUTH_SECRET,
});