# DevDesk

DevDesk is a small API workspace for organizing HTTP requests, collections, and environment variables. Requests can use `{{variable}}` placeholders and be sent through a Supabase Edge Function proxy, with the response status and body shown in the app.

![DevDesk application](./screenshots/devdesk-home.png)

## Features

- Create workspaces, collections, and saved API requests.
- Store headers, query parameters, request bodies, and request notes.
- Define environment variables and select an active environment per workspace.
- Substitute `{{variable}}` values in a request before sending it.
- Send requests through the `send-request` Supabase Edge Function and inspect the response.
- Sign in and persist application data with Supabase Auth and Postgres.

## Requirements

- Node.js 22 or newer
- pnpm 10
- A Supabase project with the database schema and migrations applied

## Local setup

```sh
pnpm install
```

Copy `.env.example` to `.env`, then set the Supabase project URL and anon key:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Start the development server:

```sh
pnpm dev
```

## Supabase setup

Apply the SQL migration in `supabase/migrations` to your project. Deploy the Edge Function so the Send button can proxy requests:

```sh
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy send-request
```

The function accepts authenticated Supabase function invocations, handles CORS preflight requests, and blocks common local/private IPv4 destinations. Avoid placing secrets in requests that may be shared with other workspace members.

## Quality checks

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

GitHub Actions runs these four checks for pushes and pull requests.

## License

MIT. See [LICENSE](./LICENSE).
