import Provider from '@ant-design/react-native/es/provider';
import { ReloadContainer } from '@/components/reload';
import { WrappedContainer } from '@/layouts/Routes';
import React from 'react';

export default () => (
  <ReloadContainer>
    <Provider>
      <WrappedContainer />
    </Provider>
  </ReloadContainer>
);
