import { axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import React, { useEffect, useRef } from 'react';

import { useDispatchContext, usePlotContext } from '../hooks';
import type { YAxisProps } from '../types';

const YAxis = ({
  label,
  fontSize = 16,
  labelSpace = 30,
  showGridLines,
  labelStyle,
  min,
  max,
  paddingBottom = 0,
  paddingTop = 0,
  display = true,
}: YAxisProps) => {
  const axisRef = useRef(null);
  const {
    yScale,
    yScientific,
    plotHeight,
    plotWidth,
    left,
    top,
    width,
  } = usePlotContext();
  const { dispatch } = useDispatchContext();

  // Send min and max to main state
  useEffect(() => {
    dispatch({ type: 'yMinMax', value: { min, max } });
  }, [dispatch, min, max]);

  // Send paddings to main state
  useEffect(() => {
    if (paddingBottom < 0 || paddingBottom > 1) {
      throw new Error(
        `Padding bottom (${paddingBottom}) is not between 0 and 1`,
      );
    }
    if (paddingTop < 0 || paddingTop > 1) {
      throw new Error(`Padding top (${paddingTop}) is not between 0 and 1`);
    }

    dispatch({
      type: 'yPadding',
      value: { min: paddingBottom, max: paddingTop },
    });
  }, [dispatch, paddingBottom, paddingTop]);

  useEffect(() => {
    if (axisRef?.current && yScale) {
      const axis = axisLeft(yScale);

      if (showGridLines) {
        axis.tickSizeInner(-plotWidth);
      }
      if (yScientific) {
        axis.tickFormat((val) => val.toExponential(2));
      }

      select(axisRef.current)
        .call(axis)
        .call((g) => {
          g.selectAll('.tick line')
            .attr('stroke-opacity', showGridLines ? 0.5 : 1)
            .attr('stroke-dasharray', showGridLines ? '2,2' : '0')
            .style('display', display || showGridLines ? 'inline' : 'none');
          g.selectAll('.tick text')
            .attr('transform', `translate(${showGridLines ? -6 : 0},0)`)
            .style('user-select', 'none')
            .style('display', display ? 'inline' : 'none');

          g.selectAll('path.domain').style(
            'display',
            display ? 'inline' : 'none',
          );
        });
    }
  }, [axisRef, yScale, plotWidth, width, showGridLines, yScientific, display]);

  return (
    <>
      <g ref={axisRef} transform={`translate(${left}, 0)`} />
      {label && display && (
        <text
          transform={`translate(${
            left - fontSize - labelSpace - (yScientific ? 14 : 0)
          }, ${top + plotHeight / 2})rotate(-90)`}
          dy={fontSize}
          textAnchor="middle"
          fontSize={fontSize}
          style={labelStyle}
        >
          {label}
        </text>
      )}
    </>
  );
};

export default YAxis;