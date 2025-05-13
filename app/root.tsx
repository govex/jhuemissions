import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
  } from "react-router";
  import type { Route } from "./+types/root";
  import supabase from "~/utils/supabase";
  import stylesheet from "./app.css?url";

  export const links: Route.LinksFunction = () => [
    { rel: "stylesheet", href: stylesheet }
  ];
  
  export async function loader({}: Route.LoaderArgs) {
    let places = await supabase.from('places').select();
    let schools = await supabase.from('business_area').select();
    let map = await supabase.from('map').select();
    let bookings = await supabase.from('bookings').select();
    let timeline = await supabase.from('timeline').select();
    let filters = {school: "All JHU", years:["FY23-24"]};
    let airports = await supabase.from('airports').select();
    const fiscalYearOptions = [
      {label: "FY23-24", value: "FY23-24", order: 7},
      {label: "FY22-23", value: "FY22-23", order: 6},
      {label: "FY21-22", value: "FY21-22", order: 5},
      {label: "FY20-21", value: "FY20-21", order: 4},
      {label: "FY19-20", value: "FY19-20", order: 3},
      {label: "FY18-19", value: "FY18-19", order: 2},
      {label: "FY17-18", value: "FY17-18", order: 1}
    ]
    let topline_jhu = await supabase.from('alljhutopline').select();
    let topline_school = await supabase.from('school_topline').select();
    let traveler_jhu = await supabase.from('traveler_topline').select();
    let map_jhu = await supabase.from('map_alljhu').select();
    let timeline_jhu = await supabase.from('timeline_alljhu').select();
    let school_percent = await supabase.from('school_percent').select();
    let traveler_percent = await supabase.from('traveler_percent').select();
    return {
      places: places.data,
      schools: schools.data,
      map: {school: map.data, jhu: map_jhu.data},
      timeline: {school: timeline.data, jhu: timeline_jhu.data},
      bookings: {school: topline_school.data, traveler_jhu: traveler_jhu.data, traveler_school: bookings.data, topline: topline_jhu.data }, 
      percent: {school: school_percent.data, traveler: traveler_percent.data},
      airports: airports.data,
      filters,
      fiscalYearOptions
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
  
  export default function App() {
    return <Outlet />;
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