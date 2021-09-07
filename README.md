## Set-up your dev server

Make some certs in `.ssl/*`

Make a `.env` file:

```
HTTPS=true
SSL_CRT_FILE=.ssl/cert.pem
SSL_KEY_FILE=.ssl/key.pem

REACT_APP_SUPABASE_URL=https://API_URL.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY
SUPABASE_OPENAPI_URL=https://API_URL.supabase.co/rest/v1/?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY

REACT_APP_SOULECTION_BASE_URL=https://soulection.com/
```


## Generate Typescript Types

```bash
# Can't put this into package.json due to env variables
npx openapi-typescript $SUPABASE_OPENAPI_URL  --output src/types-supabase.d.ts --version 2
```