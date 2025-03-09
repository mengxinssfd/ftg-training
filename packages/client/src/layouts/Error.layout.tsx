import React from 'react';
import { useRouteError } from 'react-router-dom';

export function ErrorLayout(): JSX.Element {
  const err = useRouteError() as Error & {
    status?: number;
    statusText?: string;
  };
  return (
    <React.Fragment>
      <strong>Error {err.status || 500}</strong>: {err.statusText ?? err.message}
    </React.Fragment>
  );
}
