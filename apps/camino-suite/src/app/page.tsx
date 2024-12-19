'use client';

import { Typography } from '@camino/ui';

export default function Index() {
  return (
    <div>
      <div className="w-full">
        <div className="container ">
          <div className='flex flex-col items-start justify-center'>
            <Typography variant="h6" as="h6">
              Hello there,
            </Typography>
            <Typography variant="h5" as="h5">
              Welcome camino-suite 👋
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
