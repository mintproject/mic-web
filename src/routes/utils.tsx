import * as React from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'
import type { RouteProps } from 'react-router-dom'
import {ErrorBoundary} from 'react-error-boundary'

import { useKeycloak } from '@react-keycloak/web'

interface PrivateRouteParams extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
}

interface ErrorProps {
  error: any,
  resetErrorBoundary: any
}

function ErrorFallback(props: ErrorProps) {
  return (
    <div role="alert">
      <p>Something went wrong: {props.error.message}</p>
    </div>
  )
}

export function PrivateRoute({
  component: Component,
  ...rest
}: PrivateRouteParams) {
  const { keycloak } = useKeycloak()

  return (
    <Route
      {...rest}
      render={(props) =>
        keycloak?.authenticated ? (
          <ErrorBoundary  FallbackComponent={ErrorFallback}>
            <Component {...props} />
          </ErrorBoundary>
        ) : (
            keycloak.login()
        )
      }
    />
  )
}
