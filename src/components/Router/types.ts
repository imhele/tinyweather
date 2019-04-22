import React from 'react';

export type Scope = { include?: Scope; exclude?: Scope } | Set<string | number> | string | number;

export interface Route {
  children?: Route;
  hideInMenu?: boolean;
  layouts?: string[];
  name?: React.ReactNode;
  page: string;
  scope?: Scope;
  title?: React.ReactNode;
  [key: string]: any;
}
