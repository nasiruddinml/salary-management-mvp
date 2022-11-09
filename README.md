# Employees Management - MVP

MVP employee salary management webapp to manage
employees' salaries. This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## What's Included

- `Next`
- `Server-side rendering`
- `Sqlite3`
- `Prisma`
- `typescript`
- `redux`
- `redux toolkit`
- `Antd`
- `Atomic Design Principle`

## Features

1. User login with mock auth api [https://mocki.io/v1].
2. Multiple employees information insert/update from csv.
3. Update / delete single employee information
4. Employees list/data table
   - get data by paginate with page limit.
   - get data by sorting.
   - get data by filtering salary range.

## REQUIREMENTS

"node": ">=14.0.0 <16.18.0"

## Installation

1. `cd /project-directory`
2. Make a file named `.env.local`
3. copy the content of `.example.env` and paste to `.env.local`
4. give the following env variable values:
   > baseUrl=http://localhost:3000
   > apiUrl=https://mocki.io/v1
5. `npm install`

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Getting Started

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/](http://localhost:3000/api/).

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Project Structure & Architecture

### Folder Structure

 .
    ├── ...
		├── README.md          			# Documentation file
		├── cypress.config.ts   		# Cypress config file
		├── .env.local				   		# Environment variable file
		├── .eslintrc.json		   		# Eslint config file
		├── less-support.d.ts   		# type definition for less
		├── next-env.d.ts		       	# type definition for next
		├── next.config.js		   		# Next js config file
		├── package-lock.json    		# package lock file for npm
		├── package.json    				# package file for node
		├── tsconfig.json          	# typescript config file
    ├── pages             			# Hold all pages and apis
    │   ├── api	        				# Hold our all api routes
		│   │   ├── employees				# employees route
		│   │   ├── file-upload			# file-upload route
		│   │   └── index.ts				# Base api route
    │   ├── dashboard         	# Our dashboard page
		│   ├── employees         	# Our employees page
		│   ├── settings         		# Our settings page
		│   ├── login								# Our login page
		│   ├── logout							# Our logout page
    │   └── index.ts          	# Our base page
		├── prisma
		│   ├── dev.db							# Our local sqlite DB
		│   ├── migrations					# Hold our all migrations
		│   └── schema.prisma				# Our database schema
		├── public									# Hold our public assets
		├── src											# Hold our application code
		│   ├── api									# Hold api related functions
		│   ├── components					# Hold our all components
		│   │   ├── atoms						# Hold our all atomic components
		│   │   └── molecules				# Hold our all molecules components
		│   ├── constants						# Hold all our constants
		│   ├── features						# All our feature goes here
		│   ├── helpers							# All our helper methods goes here
		│   ├── layouts							# Hold our application layouts
		│   ├── redux								# Hold our store & reducer
		│   └── types								# hold our all types
		├── styles									# hold our styles
    └── ...


### Design Structure

1. Atomic design principle was followed
2. User Interface can broken down into `atoms`, and`molecules` as components.
3. The main output will be rendered as a `page`.
4. `less` is used as a css preprocessor for styling

### Global State Structure

1. `Redux` is used as global state management
2. Store will wrap the main component to use the state globally
3. Multiple reducer can be created and will be included into the `src/redux/root.reducer.ts`

### Naming Convention

1. `camel case` is used for ts function and variable
2. `pascal case` is used for naming component

#### Components & Pages

1. components are in `src/components/` folder
2. And page which is the main user interface is in `pages/` folder
3. All the API's are in `/pages/api/`.

## Todo:

1. Improve the performance. Lazy load, Optimization of api calls and employee page.
2. Add some global setting to apply whole application.
3. More function and utils to less to make it more robust.
4. Apply CI/CD through github actions feature. Such testing, build and deployment.
5. Writing more comments to code. And use sonar-cube to measure it.
6. Writing Unit / Integration test via Cypress/jest.
7. Use more the store feature from redux.
