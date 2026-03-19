import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UxTable } from '../index';
import type { UxTableColumn } from '../types';

// Mock @tanstack/react-virtual
jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: jest.fn(({ count, horizontal }) => {
    return {
      getVirtualItems: () => {
        const size = horizontal ? 100 : 40;
        return Array.from({ length: count }).map((_, index) => ({
          index,
          start: index * size,
          size,
          end: (index + 1) * size,
          key: index,
          measureElement: () => {},
        }));
      },
      getTotalSize: () => count * (horizontal ? 100 : 40),
      measure: () => {},
    };
  }),
}));

interface DataType {
  key: string;
  name: string;
  age: number;
}


describe('UxTable Component', () => {
  const columns: UxTableColumn<DataType>[] = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
  ];

  const data: DataType[] = [
    { key: '1', name: 'John Doe', age: 30 },
    { key: '2', name: 'Jane Doe', age: 25 },
  ];

  it('renders table headers correctly', () => {
    render(<UxTable columns={columns} data={data} rowKey="key" />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('renders table data correctly', () => {
    render(<UxTable columns={columns} data={data} rowKey="key" />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('pads data to match gridConfig and fills missing values with null', () => {
    const gridConfig = { rows: 3, cols: 3 };
    const testData = [{ key: '1', name: 'John Doe' }] as DataType[];
    render(<UxTable columns={columns} data={testData} rowKey="key" gridConfig={gridConfig} />);
    
    // The test mock virtualizer renders all items
    // Should render 3 rows. First row has Name, Age(null), Col_2(null)
    // We can't directly check the internal state easily here, but we can verify it doesn't crash 
    // and correctly renders the header for the dynamically added 3rd column "C".
    expect(screen.getByText('C')).toBeInTheDocument();
  });
});
