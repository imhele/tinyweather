import intl from '@/components/intl';
import { Color } from '@/config';
import { Omit } from '@/utils/types';
import React, { FC } from 'react';
import { RefreshControl, RefreshControlProps, ScrollView, ScrollViewProps } from 'react-native';

export interface PageContainerProps extends ScrollViewProps {
  onRefresh?: () => void;
  refreshColor?: string;
  refreshing?: boolean;
  refreshProps?: Omit<RefreshControlProps, 'onRefresh' | 'refreshing' | 'title'>;
  refreshTitle?: string;
}

const PageContainer: FC<PageContainerProps> = ({
  children,
  onRefresh,
  refreshColor = Color.Primary,
  refreshing = false,
  refreshProps = {},
  refreshTitle = intl.U('SLOGAN'),
  ...props
}) => (
  <ScrollView
    pinchGestureEnabled={false}
    refreshControl={
      <RefreshControl
        colors={[refreshColor]}
        style={{ backgroundColor: refreshColor }}
        {...refreshProps}
        onRefresh={onRefresh}
        refreshing={refreshing}
        title={refreshTitle}
      />
    }
    {...props}
  >
    {children}
  </ScrollView>
);

export default PageContainer;
