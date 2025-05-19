# JHU Travel Emissions Dashboard Project

## Project Description

Inspired by [MIT’s Office of Sustainability’s Business Travel Dashboard](https://sustainability.mit.edu/article/new-mit-business-travel-dashboard-debuts-datapool), JHU’s International Vaccine Access Center (IVAC) has won an award to create a dashboard that depicts/visualizes JHU’s business travel emissions data for a JHU-affiliate audience. This data is pulled from travel expense data submitted via Concur (JHU’s reimbursement application).

IVAC demoed this tool at JHU’s Symposium on Sustainability, April 2, 2025.

## Desired Outcomes

1. Users develop a common understanding of the global impact of JHU business travel.
2. Users change their decision-making process to consider emissions as well as schedule and cost when booking travel.
3. Users make requests to incorporate additional information to better inform their decisions.

## Project Benefits

1. Communicate the climate emissions impact of business travel to faculty and administrative leaders about.
2. Enable a holistic accounting for a portion of scope 3 emissions, which are often much larger than other types of greenhouse gas emissions for universities.
3. Foster an enabling environment for mitigation efforts to address scope 3 which will follow on later and be driven by faculty priorities.

## Project Dependencies

![react](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![react-router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)

- map using [D3.js](https://d3js.org/) and [Natural Earth GeoJSON](https://github.com/martynafford/natural-earth-geojson)
- emissions calculator using [Carbon Interface Flights API](https://www.carboninterface.com/flights) and [The Global Airport Database](https://www.partow.net/miscellaneous/airportdatabase/)

## Maintenance Information

GovEx accounts were created for the implementation and deployment of this project at Netlify, Supabase, and Carbon Interface by Heather Bree. Analytics for this project can be viewed in GovEx's Google Tag Manager Dashboard. SSO authentication is configured under the GovEx owned JHU IMI account.

### For Future Development

This repository features two branches, main and staging, that are each tied to an automatic netlify branch deployment on push.

Development workflow:

Local branch -> Staging -> Main

Scripts used to process data can be found in [a separate repository](https://github.com/govex/jhuemissions_data). Scripts output CSV files that are uploaded into tables in Supabase. To update data new source files must be requested from JHU Travel and processed with these scripts.
