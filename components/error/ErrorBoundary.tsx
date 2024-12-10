"use client";

import * as React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="my-8">
          <Icons.warning className="h-4 w-4" />
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            {this.state.error?.message}
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}
