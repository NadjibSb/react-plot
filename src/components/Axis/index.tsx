import { useEffect } from 'react';

import { useDispatchContext } from '../../hooks';
import type { AxisChildProps, AxisProps } from '../../types';

import BottomAxis from './BottomAxis';
import BottomLogAxis from './BottomLogAxis';
import LeftAxis from './LeftAxis';
import LeftLogAxis from './LeftLogAxis';
import RightAxis from './RightAxis';
import RightLogAxis from './RightLogAxis';
import TopAxis from './TopAxis';
import TopLogAxis from './TopLogAxis';

export default function Axis({
  id,
  position,
  min,
  max,
  paddingStart,
  paddingEnd,
  flip = false,
  scale = 'linear',

  // children props
  label,
  fontSize = 16,
  labelSpace = 24,
  displayGridLines,
  labelStyle,
  hidden = false,
  tickStyle = {},
  hiddenTicks,
  tickEmbedded,
  tickLength = 6,
  hiddenSecondaryTicks,
}: AxisProps) {
  const { dispatch } = useDispatchContext();

  const xY = ['top', 'bottom'].includes(position) ? 'x' : 'y';
  useEffect(() => {
    const minPadding = paddingStart || 0;
    const maxPadding = paddingEnd || 0;

    if (minPadding < 0 || minPadding > 1) {
      throw new Error(
        `Padding ${position} (${minPadding}) is not between 0 and 1`,
      );
    }
    if (maxPadding < 0 || maxPadding > 1) {
      throw new Error(
        `Padding ${position} (${maxPadding}) is not between 0 and 1`,
      );
    }

    dispatch({
      type: 'newAxis',
      value: {
        id: id || xY,
        position,
        min,
        max,
        paddingStart: minPadding,
        paddingEnd: maxPadding,
        flip,
        scale,
      },
    });

    return () => dispatch({ type: 'removeAxis', value: { id: id || xY } });
  }, [
    dispatch,
    xY,
    id,
    position,
    min,
    max,
    flip,
    paddingStart,
    paddingEnd,
    scale,
  ]);

  const childProps: AxisChildProps = {
    id: id || xY,
    displayGridLines,
    hidden,
    label,
    labelSpace,
    labelStyle,
    fontSize,
    tickStyle,
    hiddenTicks,
    tickEmbedded,
    tickLength,
    hiddenSecondaryTicks,
  };

  switch (`${position}-${scale}`) {
    case 'top-log':
      return <TopLogAxis {...childProps} />;
    case 'top-linear':
      return <TopAxis {...childProps} />;
    case 'bottom-log':
      return <BottomLogAxis {...childProps} />;
    case 'bottom-linear':
      return <BottomAxis {...childProps} />;
    case 'left-log':
      return <LeftLogAxis {...childProps} />;
    case 'left-linear':
      return <LeftAxis {...childProps} />;
    case 'right-log':
      return <RightLogAxis {...childProps} />;
    case 'right-linear':
      return <RightAxis {...childProps} />;
    default:
      return null;
  }
}
