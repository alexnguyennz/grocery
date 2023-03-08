http://grocery.alexnguyen.co.nz

A full-stack Next.js + Supabase e-commerce project. Initially intended to reproduce main features of [Countdown](https://countdown.co.nz) - an online groceries site.

Doesn't reproduce stock management, logistics, etc. that would actually be involved with this sort of service.

### Frontend

- [Next.js](https://nextjs.org/) (TypeScript) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - styling
- [Mantine](https://mantine.dev/) - UI components library
- [Vercel](https://vercel.com/) - frontend hosting and serverless functions
- [React Query](https://tanstack.com/query/latest/) - data fetching management
- [Zustand](https://github.com/pmndrs/zustand) - state management

### Backend

- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Postgres](https://www.postgresql.org/) - database
- [Stripe](https://stripe.com/) - payments integration
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview) - address auto-completion

### To Do

- Add more products
- For production - lock down database / [Supabase](https://supabase.com/docs/guides/platform/going-into-prod)
- backend based cart session
