'use client';

import { Typography } from '@camino/ui';

export default function Index() {
  return (
    <div>
      <div className="w-full">
        <div className="container ">
          <div className='flex flex-col items-start justify-center'>
            <Typography variant="h3" as="h3">
              Hello there,
            </Typography>
            <Typography variant="h1" as="h1">
              Welcome camino-suite 👋
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
