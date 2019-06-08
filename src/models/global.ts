import { PX } from '@/config';

export interface GlobalState {
  wingBlank: number;
}

const GlobalModel = {
  state: {
    wingBlank: 12,
  } as GlobalState,
  reducers: {},
};

export default GlobalModel;
