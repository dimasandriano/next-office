import { ColumnDef } from '@tanstack/react-table';
import { assign, get } from 'lodash';

type Options = {
  minSize?: number;
  maxSize?: number;
};
export function generateSize<T>(
  columns: ColumnDef<T>[],
  widthTableContainer: number,
  options?: Options,
) {
  const widthTableContainerMinus7 = widthTableContainer - 7;
  const totalSize = columns.reduce(
    (prev, cur) => prev + get(cur, 'meta.sizeScale', 2),
    0,
  );
  const calculateSize = (column: ColumnDef<T>) => {
    let columnSizeScale = 2;
    if (
      typeof (get(column, 'meta.sizeScale') as number | undefined) === 'number'
    ) {
      columnSizeScale = get(column, 'meta.sizeScale') || (0 as number);
    }
    const calculatedSize = widthTableContainerMinus7
      ? (parseFloat(columnSizeScale.toString()) * widthTableContainerMinus7) /
        parseFloat(totalSize.toString())
      : 200;
    if (calculatedSize < get(options, 'minSize', 0)) {
      return get(options, 'minSize', 0);
    }
    if (calculatedSize > get(options, 'maxSize', 1920)) {
      return get(options, 'maxSize', 1920);
    }
    if (calculatedSize < get(column, 'meta.minSize', 0)) {
      return get(column, 'meta.minSize');
    }
    if (calculatedSize > get(column, 'meta.maxSize', 1920)) {
      return get(column, 'meta.maxSize');
    }
    return calculatedSize;
  };

  // TODO: update to support recursive columns
  return columns.map((col) => {
    return assign(col, { size: calculateSize(col) });
  });
}
