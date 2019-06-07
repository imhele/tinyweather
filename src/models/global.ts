import { PX } from '@/config';

export interface GlobalState {
  wingBlank: number;
}

const GlobalModel = {
  state: {
    wingBlank: PX(24),
  } as GlobalState,
  reducers: {},
};

export default GlobalModel;
