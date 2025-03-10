import React from 'react';
import { Outlet } from 'react-router-dom';

export function AppLayout(): JSX.Element {
  return (
    <React.Fragment>
      <React.Suspense>
        <Outlet />
      </React.Suspense>
    </React.Fragment>
  );
}
