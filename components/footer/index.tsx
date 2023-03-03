import NextLink from 'next/link';

import {
  Paper,
  Switch,
  useMantineTheme,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSun, IconMoonStars } from '@tabler/icons-react';

import departments from '@/src/data/departments.json';

export default function Footer() {
  const theme = useMantineTheme();

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Paper component="footer">
      <h2 className="sr-only">Footer</h2>
      <div className="container mx-auto px-3 py-10 sm:py-18">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <NextLink className="inline-block hover:no-underline" href="/">
              <h3 className="font-extrabold text-4xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                  Grocery
                </span>
              </h3>
            </NextLink>
            <div className="flex space-x-5">
              <a href="#">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a
                href="#"
                className="text-scale-900 hover:text-scale-1200 transition"
              >
                <span className="sr-only">Youtube</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 576 512"
                  aria-hidden="true"
                >
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <h4 className="font-bold">Browse</h4>
                <ul className="mt-2 space-y-2 text-sm columns-2">
                  {departments.map((department) => (
                    <li key={department.slug}>
                      <NextLink href={`/shop/browse/${department.slug}`}>
                        {department.name}
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold">Account</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    <NextLink href="/account/orders">My Orders</NextLink>
                  </li>
                  <li>
                    <NextLink href="/account/">Manage Account</NextLink>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold">Company</h4>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    <a href="#">Contact</a>
                  </li>
                  <li>
                    <a href="#">Store Locations</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                  <li>
                    <a href="#">Community and Environment</a>
                  </li>
                  <li>
                    <a href="#">News and Media</a>
                  </li>
                  <li>
                    <a href="#">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-between items-center border-t pt-8 text-sm">
          <p>&copy; Grocery New Zealand Limited {new Date().getFullYear()}</p>

          <Switch
            color="cyan.6"
            checked={colorScheme === 'dark'}
            onChange={() => toggleColorScheme()}
            size="lg"
            onLabel={<IconSun color={theme.white} size={20} stroke={1.5} />}
            offLabel={
              <IconMoonStars
                color={theme.colors.gray[6]}
                size={20}
                stroke={1.5}
              />
            }
          />
        </div>
      </div>
    </Paper>
  );
}
