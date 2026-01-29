import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
  } from "react-router";
  import {AuthProvider} from "~/provider/AuthProvider";
  import type { Route } from "./+types/root";
  import stylesheet from "./app.css?url";

  export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com"},
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous"},
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap"},
    { rel: "stylesheet", href: stylesheet }
  ];

  export async function loader({ request }: Route.LoaderArgs) {
    let filters = {school: "All JHU", years:["FY23-24"]};
    const fiscalYearOptions = [
      {label: "FY23-24", value: "FY23-24", order: 7},
      {label: "FY22-23", value: "FY22-23", order: 6},
      {label: "FY21-22", value: "FY21-22", order: 5},
      {label: "FY20-21", value: "FY20-21", order: 4},
      {label: "FY19-20", value: "FY19-20", order: 3},
      {label: "FY18-19", value: "FY18-19", order: 2},
      {label: "FY17-18", value: "FY17-18", order: 1}
    ]
    const origin = new URL(request.url).origin;
    let places = await fetch(origin + '/data/places_rows.json').then(res => res.json());
    let schools = await fetch(origin + '/data/business_area_rows.json').then(res => res.json());
    let map = await fetch(origin + '/data/map_rows.json').then(res => res.json());
    let bookings = await fetch(origin + '/data/bookings_rows.json').then(res => res.json());
    let timeline = await fetch(origin + '/data/timeline_rows.json').then(res => res.json());
    let airports = await fetch(origin + '/data/airports_rows.json').then(res => res.json());
    let topline_jhu = await fetch(origin + '/data/alljhutopline_rows.json').then(res => res.json());
    let topline_school = await fetch(origin + '/data/school_topline_rows.json').then(res => res.json());
    let traveler_jhu = await fetch(origin + '/data/traveler_topline_rows.json').then(res => res.json());
    let map_jhu = await fetch(origin + '/data/map_alljhu_rows.json').then(res => res.json());
    let timeline_jhu = await fetch(origin + '/data/timeline_alljhu_rows.json').then(res => res.json());
    let school_percent = await fetch(origin + '/data/school_percent_rows.json').then(res => res.json());
    let traveler_percent = await fetch(origin + '/data/traveler_percent_rows.json').then(res => res.json());
    return {
      places: places,
      schools: schools,
      map: {school: map, jhu: map_jhu},
      timeline: {school: timeline, jhu: timeline_jhu},
      bookings: {school: topline_school, traveler_jhu: traveler_jhu, traveler_school: bookings, topline: topline_jhu }, 
      percent: {school: school_percent, traveler: traveler_percent},
      airports: airports,
      filters,
      fiscalYearOptions,
    }
  }

  export function Layout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-LT2JGEXERV" />
          <script dangerouslySetInnerHTML={{__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LT2JGEXERV');
          `}}/> 
          <Meta />
          <Links />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    );
  }
  
  export default function App({}:Route.ComponentProps) {
    const root = typeof window !== 'undefined' ? window.location.origin : '';
    const secret = import.meta.env.VITE_CS;
    const configuration = {
      client_id: root + "/auth/oidc",
      redirect_uri: root + "/auth/oidc/callback",
      authority: "https://login.jh.edu",
      client_secret: secret,
      client_authentication: "client_secret_basic",
      metadata: { // https://login.jh.edu/.well-known/openid-configuration
        issuer:"https://login.jh.edu/idp/shibboleth",
        authorization_endpoint:"https://login.jh.edu/idp/profile/oidc/authorize",
        registration_endpoint:"https://login.jh.edu/idp/profile/oidc/register",
        token_endpoint:"https://login.jh.edu/idp/profile/oidc/token",
        userinfo_endpoint:"https://login.jh.edu/idp/profile/oidc/userinfo",
        introspection_endpoint:"https://login.jh.edu/idp/profile/oauth2/introspection",
        revocation_endpoint:"https://login.jh.edu/idp/profile/oauth2/revocation",
        jwks_uri:"https://login.jh.edu/idp/profile/oidc/keyset",
      },
    }

    return (
      <AuthProvider {...configuration} >
        <Outlet />
      </AuthProvider>
    );
  }
  
  export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred. Please refresh your browser.";
    let stack: string | undefined;
  
    if (isRouteErrorResponse(error)) {
      message = error.status === 404 ? "404" : "Error";
      details =
        error.status === 404
          ? "The requested page could not be found."
          : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
      details = error.message;
      stack = error.stack;
    }
  
    return (
      <main className="pt-16 p-4 container mx-auto">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
      </main>
    );
  }